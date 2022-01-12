const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const axios = require('axios');
const qs = require('qs');

const forgeCredentials = require('../config/forgeCredentials');

const api = {
  async Authenticate() {
    const url = 'https://developer.api.autodesk.com/authentication/v1/authenticate'
    const response = await axios.post(url, qs.stringify(forgeCredentials));

    this.token = response.data.access_token;
  },

  async getImagefromModel (filePath, fileName) {
    await this.Authenticate();

    const { objectKey } = await this.uploadFile(filePath, fileName);

    await this.generateUploadUrl(objectKey);
    await this.generateOutputUrl(objectKey);

    try {

      await this.setWorkItem();
    } catch (error) {
      console.log(error);
    }

    console.log('WorkItem: ', this.workItem);;


    let flag = true;

    while (flag) {
      const result = await this.checkProgress();
      console.log(result);

      if (result.status == 'success') {
        flag = false;
      } else {
        flag = true;
      }
    }

    const response = await axios.get(this.downloadUrl);

    return response.data;
  },

  async uploadFile(filePath, fileName) {
    const url = `https://developer.api.autodesk.com/oss/v2/buckets/${'thumbnail'}/objects/${fileName}`

    const config = {
      headers: {
        Authorization: `Bearer ${this.token}`,
        'accept-enconding': 'gzip, deflate'
      }
    }

    const response = await axios.put(url, fs.readFileSync(path.join(filePath)), config);
    return response.data;
  },

  async generateUploadUrl(inputFileName) {

    const url = `https://developer.api.autodesk.com/oss/v2/buckets/${'thumbnail'}/objects/${inputFileName}/signed?access=read`;

    const config = {
      headers: { Authorization: `Bearer ${this.token}` }
    }

    const response = await axios.post(url, {}, config);
    this.uploadUrl = response.data.signedUrl;
  },

  async generateOutputUrl(outputFileName) {
    const url = `https://developer.api.autodesk.com/oss/v2/buckets/${'thumbnail'}/objects/${'thumbnail.bmp'}/signed?access=readwrite`

    const config = {
      headers: { Authorization: `Bearer ${this.token}` }
    }

    const response = await axios.post(url, {}, config);
    this.downloadUrl = response.data.signedUrl;

  },

  async setWorkItem() {
    const url = `https://developer.api.autodesk.com/da/us-east/v3/workitems`;

    const body = {
        "activityId": "webiApp.GenerateThumbnail+prod",
        "arguments": {
            "PartFile": {
                "url": this.uploadUrl,
                "zip": false
            },
            "OutputBmp": {
                "url": this.downloadUrl,
                "verb": "put"
            }
        }
    }

    const config = {
      headers: { Authorization: `Bearer ${this.token}` }
    }

    try{
      const response = await axios.post(url, body, config);
      this.workItem = response.data.id;

    } catch(e) {
      console.log(e);
    }


  },

  async checkProgress() {
    const url = `https://developer.api.autodesk.com/da/us-east/v3/workitems/${this.workItem}`;

    const config = {
      headers: { Authorization: `Bearer ${this.token}` }
    }

    const response = await axios.get(url, config);
    return response.data;
  }
}

module.exports = api;
