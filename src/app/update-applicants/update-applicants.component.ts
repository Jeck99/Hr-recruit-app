import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';
import { Job } from "../ModelService/Job";
import { Applicant } from "../ModelService/Applicant";
import { ApplicantSkillset } from "../ModelService/‏‏ApplicantSkillset";
import { UploadService } from '../upload.service';
import { Upload } from '../Upload';
import * as _ from "lodash";

import { DbService } from "../DbService/DbService";
import { Manager } from "../ModelService/Manager";
import { Skill } from "../ModelService/Skill";
import { JobSkillset } from "../ModelService/JobSkillset";
import { JobRecruiter } from "../ModelService/JobRecruiter";
import { ApplicantRecruiter } from '../ModelService/\u200F\u200FApplicantRecruiter';
import { AngularFireDatabase } from 'angularfire2/database';
import { NotificationsService } from '../notifications/notifications.component';

@Component({
  selector: 'app-update-applicants',
  templateUrl: './update-applicants.component.html',
  styleUrls: ['./update-applicants.component.css'],
  providers : [AngularFireDatabase,UploadService]

})
export class UpdateApplicantsComponent implements OnInit {

  constructor(private Service: DbService,private upSvc: UploadService) { }
  currentUpload: Upload;
  dropzoneActive:boolean = false;
UpdateUrl = false;
OnOver=false;
  ngOnInit() {
    this.GetSkills();
    this.GetRecruiters();
  }
  FileOver()
  {
this.OnOver=!this.OnOver;
  }
 Color=false;
 dropzoneState($event: boolean) {
  this.dropzoneActive = $event;
  this.Color=!this.Color;
}
handleDrop(fileList: FileList) {
  let filesIndex = _.range(fileList.length)
  _.each(filesIndex, (idx) => {
    console.log("idx",idx);
    this.currentUpload = new Upload(fileList[idx]);
    console.log("currentUpload",this.currentUpload);
   
   this.upSvc.pushUpload(this.currentUpload);
}   
  )
}

 
  @Input() ApplicantToUpdate : Applicant;
  @Output() Appearance = new EventEmitter<string>();
  
  Skills: Skill[];
  Recruiters: Manager[];
  

  GetSkills() {
    let req = this.Service.Get("JobSkillsets")
    req.subscribe(rsp => {
      this.Skills = rsp.json();
      console.log(this.Skills);
    });
  }


  GetRecruiters() {
    let req = this.Service.Get("Managers")
    req.subscribe(rsp => {
      this.Recruiters = rsp.json();
      console.log(this.Recruiters);
    });
  }

  CloseForm()
  {
    this.Appearance.emit("");   
  }


  AppRecruiter: ApplicantRecruiter[] = [];
  
    PostApplicantRecruiters() {
      this.ApplicantToUpdate.Recruiters.forEach(element => {
        this.AppRecruiter.push(new ApplicantRecruiter(this.ApplicantToUpdate.Id, element.Id));
      });
      const req = this.Service.EditCollection("ApplicantRecruiters", this.AppRecruiter, this.ApplicantToUpdate.Id);
      req.subscribe(res => {
        console.log("Job Recruiter Id's Edit Succesfully");
        console.log(res);
        this.AppRecruiter =[];
        
      },
        (err: any) => {
          console.log("error in Recruiter Id's Edit : " + err);
          console.log(err.json());
          this.AppRecruiter =[];
          
        });
    }

  SkillSet: ApplicantSkillset [] = [];
  ApplicantSkillPost() {
    this.ApplicantToUpdate.Skills.forEach(element => {
      this.SkillSet.push(new ApplicantSkillset(this.ApplicantToUpdate.Id, element.Id));
    });  
    console.log(this.SkillSet);
    const req = this.Service.EditCollection("ApplicantSkillsets", this.SkillSet, this.ApplicantToUpdate.Id);

    req.subscribe(res => {
      console.log("applicant SkillSet Edit Succesfully");
      console.log(res);
      this.SkillSet = [];
    },
      (err: any) => {
        console.log("error in Applicant skillset Edit : " + err);
        console.log(err.json());
        this.SkillSet = [];    
      });
  }


  PostApplicantToUpdate() {
    this.ApplicantToUpdate.Url = localStorage.getItem('DURL');
    
    console.log(this.ApplicantToUpdate);

    let req = this.Service.Edit("Applicants", this.ApplicantToUpdate);
    req.subscribe(res => {
      console.log("My Update Applicant Action");
      this.ApplicantSkillPost(); 
      this.PostApplicantRecruiters();
      this.Appearance.emit("success");
      localStorage.removeItem('DURL');
      
    }, (err) => {
        console.log("Editing Problem");
      });
    
  }

  CheckSkill(skil: Skill) {
    if (this.ApplicantToUpdate.Skills.find(Jskil => Jskil.Id == skil.Id))
      return true;
    else
      return false;
  }

  CheckRecruiter(Manager: Manager) {
    if (this.ApplicantToUpdate.Recruiters.find(Jrec => Jrec.Id == Manager.Id))
    return true;
    else
    return false;
  }



   AddRecruiter(recruiter : Manager)
  {
    if(this.ApplicantToUpdate.Recruiters.find(rec => rec.Id == recruiter.Id))
      {
      let RecruiterIndex = this.ApplicantToUpdate.Recruiters.findIndex(rec => rec.Id == recruiter.Id)
      this.ApplicantToUpdate.Recruiters.splice(RecruiterIndex,1);
      }
    else
      {
               this.ApplicantToUpdate.Recruiters.push(recruiter);
      } 
            console.log(this.ApplicantToUpdate.Recruiters);
     }

  AddSkill(Skil : Skill)
  {
    if(this.ApplicantToUpdate.Skills.find(Sk => Sk.Id == Skil.Id))
      {
        let SkilIndex =  this.ApplicantToUpdate.Skills.findIndex(Sk => Sk.Id ==Skil.Id);
        this.ApplicantToUpdate.Skills.splice(SkilIndex,1);
      }
    else
      {     
            this.ApplicantToUpdate.Skills.push(Skil);
      }
      console.log(this.ApplicantToUpdate.Skills);
  }


}
