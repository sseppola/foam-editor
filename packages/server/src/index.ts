import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import * as util from 'util';
import * as os from 'os';
import * as crypto from 'crypto';
import cors from 'cors';

import express, {Request, Response, NextFunction} from 'express';
import {glob as _glob} from 'glob';

declare global {
  namespace Express {
    interface Request {
      projectPath: string;
    }
  }
}

const glob = util.promisify(_glob);
const asyncAccess = util.promisify(fs.access);
const writeFile = util.promisify(fs.writeFile);

const resolveProjectPath = (projectPath: string) => {
  if (projectPath.startsWith('~')) {
    return path.join(os.homedir(), projectPath.slice(1));
  }
  return projectPath;
};

const asyncIsFoamProject = (projectPath: string): Promise<boolean> => {
  const foamJsonPath = path.join(projectPath, './.vscode/foam.json');
  return asyncAccess(foamJsonPath, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
};

const getNoteTitle = async (notePath: string) => {
  const [firstLine = ''] = await readLines(notePath, 1);
  return firstLine.startsWith('# ') ? firstLine.slice(2) : firstLine;
};

const getNoteInfo = async (notePath: string) => {
  return {
    id: hashString(notePath),
    path: notePath,
    title: await getNoteTitle(notePath),
    // createdAt
    // updatedAt
  };
};

const getProjectNotesInfo = async (projectPath: string) => {
  const notePaths = await glob('**/*.md', {cwd: projectPath});
  return Promise.all(
    notePaths
      .map((notePath) => path.join(projectPath, notePath))
      .map(getNoteInfo),
  );
};

const getNoteById = async (projectPath: string, noteId: string) => {
  const notes = await getProjectNotesInfo(projectPath);
  return notes.find((note) => note.id === noteId);
};

const hashString = (data: string) => {
  return crypto.createHash('md5').update(data).digest('hex');
};

const app = express();
const port = 3300;

app.use(
  cors({
    origin: function (origin, callback) {
      const allow = /https?:\/\/localhost/.test(origin || '');
      callback(null, allow);
    },
  }),
);
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// from https://stackoverflow.com/questions/45556535/nodejs-readline-only-read-the-first-2-lines/45556848
const readLines = (filePath: string, linesWanted = 1) => {
  const lineReader = readline.createInterface({
    input: fs.createReadStream(filePath),
  });

  const lines: string[] = [];
  return new Promise<string[]>((resolve, reject) => {
    lineReader.on('line', function (line) {
      lines.push(line);
      if (lines.length >= linesWanted) {
        lineReader.close();
      }
    });
    lineReader.on('close', function () {
      resolve(lines);
    });
  });
};

const checkFoamProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const projectPath = resolveProjectPath((req.query?.project ?? '') as string);
  const isFoamProject = await asyncIsFoamProject(projectPath);
  if (!isFoamProject) {
    return res.status(404).send('Invalid project path');
  }
  req.projectPath = projectPath;
  next(null);
};

app.get('/notes', checkFoamProject, async (req, res) => {
  const {projectPath} = req;
  const notes = await getProjectNotesInfo(projectPath);
  res.json(notes);
});

app.get('/notes/:id', checkFoamProject, async (req, res) => {
  const {projectPath} = req;
  const noteId = req.params.id ?? '';
  if (!noteId) {
    return res.status(404).send('Missing note id');
  }

  const note = await getNoteById(projectPath, noteId);
  if (!note) {
    return res.status(404).send('Could not find note');
  }

  return res.sendFile(note.path);
});

app.post('/notes/:id', checkFoamProject, async (req, res) => {
  const {projectPath} = req;
  const noteId = req.params.id ?? '';
  if (!noteId) {
    return res.status(404).send('Missing note id');
  }

  const note = await getNoteById(projectPath, noteId);
  if (!note) {
    return res.status(404).send('Could not find note');
  }

  const content = req.body.content as string;

  try {
    await writeFile(note.path, content);
  } catch (error) {
    return res.status(500).send('Failed to save file');
  }

  return res.status(200).send('OK');
});

app.listen(port, () => console.log(`Listening at http://localhost:${port}`));
