'use strict';
const ProjectController = require('../controllers/projectController.js')
let projectController = new ProjectController();

module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      const project = req.params.project;
      const q = req.query
      console.log("[get] New get api call, for project " + project)
      console.log("[get] Query: ", q)
      let filter = projectController.getIssueFromReq(project, q)
      if (filter){
        projectController.getIssueByColValues(filter, (err, data) => {
          if(data){
            console.log("[get] Result nb: ", data.length)
            res.json(data)
          }
          else{
            console.log("[get] Result error: ", err)
            res.json({'error': 'Not Found'})
          }
        })
        
      }
      else{
        projectController.getIssuesByProject(project, (err, data) => {
          console.log("[get] Get issues by project.")
          if ( Array.isArray(data) && data.length > 0 ){
            delete i_data.project_name
            res.json(data)
          }
          else{
            res.json({'error': err, data: data})
          }
        })
      }
    })
    
    .post(function (req, res){
      let project = req.params.project;
      let result
      console.log("[post] New post api call, for project " + project)
      console.log("[post] Body: ", req.body)
      projectController.findProjectAndSave(project, (err, data) => {
        if(data && data.name && req.body){
          
          let issue_item = projectController.getIssueFromForm(project, req.body);
          console.log("[post] findProjectAndSave success. Issue item: ", issue_item)
          projectController.AddNewIssue(issue_item, (i_err, i_data) =>{
            
            if(i_data && !err){
              console.log("[post] AddNewIssue success: ", i_data)
              delete i_data['project_name']
              result = i_data
            }
            else{
              console.log("[post] AddNewIssue error: ", i_err)
              result = { error: 'required field(s) missing' }
            }
            console.log("[post] AddNewIssue result: ", result)
            res.json(result)
          })
        }
        else{
          console.log("[post] findProjectAndSave error: ", data)
          result = {'error': 'not implemented'}
          console.log("[post] AddNewIssue Error result: ", result)
          res.json(result)
        }
      })
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let result
      console.log("[put] New put api call, for project " + project)
      console.log("[put] Body: ", req.body)
      const nb_fields = (req.body) ? Object.keys(req.body).length : 0;
      console.log("[put] nb_fields: ", nb_fields)
      const _id = (req.body && req.body['_id']) ? req.body['_id']: null;
      if(_id && nb_fields > 1){
        
        projectController.UpdateIssue(_id, req.body, (err, data) => {
          if(err){
            result = {'error': 'could not update', '_id': _id}
          }
          else if (data){
            result = {result: 'successfully updated', '_id': _id }
          }
          else{
            result = {'error': 'could not update', '_id': _id}
          }
          console.log("[put] Update result: ", result)
          res.json(result)
        })
      }
      else{
        result = { error: 'missing _id' }
        if (nb_fields === 1) result = { error: 'no update field(s) sent', '_id': _id }

        console.log("[put] Update error result: ", result)
        res.json(result)
      }
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      console.log("[delete] New delete api call, for project " + project)
      console.log("[delete] id: ", req.body['_id'])
      projectController.DeleteIssue(req.body['_id'], (err, data) => {
        let result
        console.log("[delete] data: ", data)
        console.log("[delete] err: ", err)
        if(req.body['_id'] === undefined){ result = {'error': 'missing _id'} }
        else if(data){ result = { result: 'successfully deleted', '_id': req.body['_id'] } }
        else{ result = {error: 'could not delete', '_id': req.body['_id']} }
        console.log("[delete] result: ", result)
        res.json(result)
      })
    });
    
};
