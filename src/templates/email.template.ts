// mail-template.ts

export class MailTemplateService {
	public verifyMailTemplate(username: string, callbackUrl: string): string {
	  return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <title>Email Confirmation for ${username}</title>
		</head>
		<body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
		  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
			<h2 style="text-align: center; color: #333;">Email Confirmation for ${username}</h2>
			<p style="font-size: 16px; color: #666;">Please confirm your email address by clicking the button below:</p>
			<div style="text-align: center; margin-top: 20px;">
			  <a href="${callbackUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Confirm Email</a>
			</div>
			<p style="font-size: 14px; color: #999; margin-top: 20px;">If you didn't request this confirmation, you can ignore this email.</p>
		  </div>
		</body>
		</html>
	  `;
	}
  
	public updateMailTemplate(username: string, callbackUrl: string): string {
	  return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <title>Password Update for ${username}</title>
		</head>
		<body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
		  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
			<h2 style="text-align: center; color: #333;">Password Update for ${username}</h2>
			<p style="font-size: 16px; color: #666;">Your password has been updated successfully.</p>
			<div style="text-align: center; margin-top: 20px;">
			  <a href="${callbackUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">View Account</a>
			</div>
		  </div>
		</body>
		</html>
	  `;
	}
  
	public deleteMailTemplate(username: string, callbackUrl: string): string {
	  return `
		<!DOCTYPE html>
		<html lang="en">
		<head>
		  <meta charset="UTF-8">
		  <meta name="viewport" content="width=device-width, initial-scale=1.0">
		  <title>Account Deletion for ${username}</title>
		</head>
		<body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
		  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
			<h2 style="text-align: center; color: #333;">Account Deletion for ${username}</h2>
			<p style="font-size: 16px; color: #666;">Your account has been successfully deleted.</p>
			<div style="text-align: center; margin-top: 20px;">
			  <a href="${callbackUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Undo Deletion</a>
			</div>
		  </div>
		</body>
		</html>
	  `;
	}
  }
  