'use strict';
const AWS = require('aws-sdk')
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })
const postTable = process.env.POSTS_TABLE;
const uuid = require('uuid');

function response(statusCode, message){
  return {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    statusCode: statusCode,
    body: JSON.stringify(message)
  }
}

function sortByDate(a,b){
  if(a.createdAt > b.createdAt){
    return -1
  } else return 1;
}
//I'm here Hafiz
module.exports.createPost = (event, context, callback) => {

  const reqBody = JSON.parse(event.body);

  const post = {
    id: uuid.v4(),
    createdAt: new Date().toISOString(),
    title: reqBody.title,
    organizer: reqBody.organizer,
    link: reqBody.link,
    visible: false,
    start: reqBody.start,
    end: reqBody.end,
  };

  return db.put({
    TableName: postTable,
    Item: post
  }).promise().then(() => {
    callback(null, response(201, post)) 
  }).catch(err => response(null, response(err.statusCode, err)))
}

module.exports.getAllPost = (event, context, callback) => {

  return db.scan({

    TableName: postTable,

  }).promise().then((res) => {

    callback(null, response(201, res.Items.sort(sortByDate))) 
    
  }).catch(err => response(null, response(err.statusCode, err)))

}