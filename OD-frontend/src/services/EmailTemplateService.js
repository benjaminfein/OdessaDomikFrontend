import axios from "axios";

const REST_API_BASE_URL = 'http://localhost:8090/api/email-templates';

export const listTemplates = () => axios.get(REST_API_BASE_URL + "/get-all-templates");

export const getTemplateByKey = (templateKey) => axios.get(REST_API_BASE_URL + "/get-template-by-key/" + templateKey);

export const updateTemplate = (templateId) => axios.put(REST_API_BASE_URL + "/update-template/" + templateId);

export const deleteTemplate = (templateId) => axios.delete(REST_API_BASE_URL + "/delete-template/" + templateId);