export class Person {
    _id?: string;
    userid: string;
    firstname: string;
    lastname: string;
    email: string;
    linkedin: string;
    twitter: string;
    role: string;

    interest: [{ areaId: number;
                level: number}]
                
    university: string;
}

