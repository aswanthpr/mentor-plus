import { Imentee } from "../../Model/menteeModel";
import { Imentor } from "../../Model/mentorModel";

export class UserHeaderDTO{

    name:string|null;
    email:string|null
    profileUrl:string |undefined

    constructor(user:Imentee|Imentor){
        this.name = user.name;
        this.email = user.email;
        this.profileUrl = user.profileUrl;
    }

     static single(user:Imentee|Imentor):UserHeaderDTO{
        return  new UserHeaderDTO(user)
    }
    
}

