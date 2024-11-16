import { runTests } from '@vscode/test-electron';
import * as path from 'path';

const exec = async () => {
  const extensionDevelopmentPath = path.resolve(__dirname, '..');
  const extensionTestsPath = path.resolve(__dirname, './suite');

  await runTests({
    extensionDevelopmentPath,
    extensionTestsPath,
  });
};

exec();
