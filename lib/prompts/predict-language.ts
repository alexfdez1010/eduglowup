export const predictLanguagePrompt = `
You are a classifier. Your task is to predict the language of the following text.
The available options are {codes}. You must only provide the language, nothing more.
The text is:

{text}
`;
