import { Pageination } from "./pagination";

export interface SnippetInput {
  id?: number;
  title: string;
  description: string | null;
  code: string;
  language: Languages;
  tags: string[];
  userId: number;
}
export interface SnippetResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string | null;
  code: string;
  language: Languages;
  tags: string[];
}

export interface SnippetShortResponse {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  language: Languages;
  tags: string[];
}

export interface SnippetPageination extends Pageination {
  details: SnippetShortResponse[];
}

export enum Languages {
  JavaScript = "javascript",
  TypeScript = "typescript",
  Python = "python",
  java = "java",
  CSharp = "csharp",
  Go = "go",
  PHP = "php",
  HTML = "html",
  CSS = "css",
  Bash = "bash",
  SQL = "sql",
  Swift = "swift",
  Kotlin = "kotlin",
  Dart = "dart",
  Shell = "shell",
  C = "c",
  Cpp = "cpp",
  Assembly = "assembly",
}
