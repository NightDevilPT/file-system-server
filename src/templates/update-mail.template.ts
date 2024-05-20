export const sendMailTemplate = (origin: string, username: string) => {
  return `<h1>Email Verification Mail</h1></br><p>Hi ${username}</p></br><p>click the link to verify your mail-id : ${origin}</p>`;
};
