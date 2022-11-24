let Issue = require('../models/Issue.js');
let Project = require('../models/Project.js');

function ProjectController() {
  
  this.getProjectByName = (name, done) => {
    let project = Project
      .findOne({"name": name}, (err, data) => {
        done(err, data);
      });
    
  }

  this.findProjectAndSave = (name, done) => {
    try {
      this.getProjectByName(name, (err, data) => {
        if(data && data.name){
          done(err, data);
        }
        else{
          let project = new Project({name: name});
            project.save(function(s_err, s_data) {
              done(s_err, s_data);
            });
        }
      })
      
    } catch (error) {
      done(error, null);
    }
    
  }
  
  this.issueKeys = ['_id', 'issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'created_on', 'updated_on', 'open']
  
  this.getIssuesByProject = (project, done) => {
    let issue = Issue
      .find({"name": project}, (err, data) => {
        done(err, data);
      })
      .select(this.issueKeys);
    
  }

  this.getIssuefilter = (filter) => {
    let result = {};
    if(filter){
      const cols = Object.keys(Issue.schema.paths);
      console.log("[getIssuefilter] Issue cols: ", cols)
      for (let name of cols) {
        if(filter[name]) result[name] = filter[name];
      }
      
    }
    return result
  }

  this.getIssueById = (issue_id, done) => {
    let issue = Issue
      .findOne({'_id': issue_id}, (err, data) => {
        done(err, data);
      })
      .select(this.issueKeys);
  }
  this.getIssueByColValues = (filter, done) => {
    console.log("[getIssueByColValues] Issue filter: ", filter)
    const n_filter = this.getIssuefilter(filter)
    console.log("[getIssueByColValues] Issue n_filter: ", n_filter)
    let issue = Issue
      .find(n_filter, (err, data) => {
        done(err, data);
      })
      .select(this.issueKeys);
  }

  this.AddNewIssue = (data, done) => {
    try {
      let issue = new Issue(data);
      issue.save(function(err, data) {
        done(err, data);
      });
    } catch (error) {
      done(error, null);
    }
    
  }
  this.getIsoDate = () => {
    const date = new Date()
    return date.toISOString()
  }
  
  this.UpdateIssue = (issue_id, data, done) => {
    try {
      this.getIssueById(issue_id, (err, res) => {
        if(res && res['_id']){
          let is_updated = false;
          Object.keys(data).forEach((key, index) => {
            if(res[key] && data[key]){
              res[key] = data[key]
              is_updated = true;
            }
          });

          if (is_updated === true ){
            res['updated_on'] = this.getIsoDate()
            res.save(function(err, data) {
              done(err, data);
            });
          }
          else{
            done(err, data);
          }
        }
        else{
          done(err, null);
        }
      })
    } catch (error) {
      done(error, null);
    }
    
  }

  this.DeleteIssue = (issue_id, done) => {
    try {
      if(issue_id){
        Issue.findByIdAndRemove({"_id": issue_id}, (err, data) =>   {
            done(err, data)
        })
      }
      else{
        done({ error: 'missing _id' }, null)
      }
    } catch (error) {
      done(error, null);
    }
  }

  this.getIssueFromReq = (project, body) => {
    let result;
    
    if (project) {
      result = {project_name: project}
      if (body){
        let keys = ['_id', 'project_name', 'issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'created_on', 'updated_on', 'open']
        Object.keys(body).forEach((key, index) => {
          if (keys.indexOf(key) > -1){
            result[key] = body[key]
          }
        })
      }
    }
    return result;
  }
  
  this.getIssueFromForm = (project, body) => {
    let result;
    
    if (project && body) {
      result = {
        project_name: project,
        issue_title: body.issue_title,
        issue_text: body.issue_text,
        created_by: body.created_by,
        assigned_to: (body.assigned_to) ? body.assigned_to : "",
        status_text: (body.status_text) ? body.status_text : "",
        open: (body.open === false) ? false: true ,
        created_on: this.getIsoDate(),
        updated_on: this.getIsoDate()
      }
      
    }
    return result;
  }
  
  
}
module.exports = ProjectController;
