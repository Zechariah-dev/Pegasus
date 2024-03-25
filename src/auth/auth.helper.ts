import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthHelper {

  validateAge(dob: any) {
    const now = new Date().toDateString();
    const diff = Date.parse(now) - Date.parse(dob);
    const diffYear = new Date(diff).getUTCFullYear();
    return diffYear - 1970 >= 18;
  }

/*   async generateAccountNumber(): Promise<string> {
    let isUnique = false;
    let accNo: string;

    while (!isUnique) {
      accNo = String(777) + Math.floor(Math.random() * 9999999).toString();
      let account = await this.AuthService.findByAccountNumber(accNo);

      if (!account) {
        isUnique = true;
      }
    }

    return accNo.toString();
  } */
}
