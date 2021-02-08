import axios from "axios";
import { convertLegacyAuthProvider } from "react-admin";
import Cookies from "./helpers/Cookies";

class Operations {
  constructor() {
    this.API = "http://localhost:1337";
    this.previousRoute = "";
    this.currentCompany = null;
    this.currentProject = null;

    this.GetCompany();

    // Add a request interceptor to add the token at each call
    axios.interceptors.request.use(
      function (config) {
        // Do something before request is sent
        const token = Cookies.getCookie("token");
        // console.log(token);

        if (token != null) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      function (error) {
        // Do something with request error
        return Promise.reject(error);
      }
    );
  }

  //Company --------------------------------------------------------
  GetCompany = async () => {
    try {
      let company = await this.getCompanyInfo();
      this.currentCompany = company[0];
    } catch (error) {
      console.log("GET COMPANY INFO", error);
    }
  };

  getCompanyInfo = async () => {
    try {
      let res = await axios.get(this.API + "/companies");
      return res.data;
    } catch (error) {
      console.log("GET COMPANIES", error);
      return null;
    }
  };

  //Projects -------------------------------------------------------
  getCompanyProjects = async () => {
    try {
      let res = await axios.get(this.API + "/projects");
      return res.data;
    } catch (error) {
      console.log("GET PROJECTS", error);
      return null;
    }
  };

  updateProjectID = async (ID, update) => {
    try {
      let res = await axios.put(this.API + "/projects/" + ID, update);
      return res.data;
    } catch (error) {
      console.log("PUT PROJECTS", error);
      return null;
    }
  };

  //Tasks ----------------------------------------------------------
  createTaskForProject = async (projectID, resourceID, stepNumber) => {
    try {
      let res = await axios.post(this.API + "/tasks", {
        project: projectID,
        resource: resourceID,
        stepNumber,
        completed: false,
      });
      return res.data;
    } catch (error) {
      console.log("CREATE TASKS FOR PROJECT", error);
    }
  };

  getTasksForProject = async (projectID) => {
    //start date is when resource accepts the job, end date is when the resource completes the task
    try {
      let res = await axios.get(this.API + "/tasks-project/" + projectID);
      return res.data;
    } catch (error) {
      console.log("GET TASKS FOR PROJECT", error);
      return null;
    }
  };

  updateTasksForProject = async (projectID, newTasks) => {
    //start date is when resource accepts the job, end date is when the resource completes the task
    try {
      let res = await axios.put(this.API + "/project-tasks/" + projectID, {
        newTasks,
      });
      return res.data;
    } catch (error) {
      console.log("PUT TASKS FOR PROJECT", error);
      return null;
    }
  };

  //PMs ------------------------------------------------------------
  getPMsForCompany = async () => {
    try {
      let res = await axios.get(this.API + "/project-managers/");
      return res.data;
    } catch (error) {
      console.log("GET PMs FOR COMPANY", error);
      return null;
    }
  };

  getPMProjects = async (ID) => {
    try {
      let res = await axios.get(this.API + "/pm-projects/" + ID);
      return res.data;
    } catch (error) {
      console.log("GET PROJECTS FOR PM", error);
      return null;
    }
  };

  //Customers ------------------------------------------------------
  getCustomersForCompany = async () => {
    try {
      let res = await axios.get(this.API + "/customers/");
      return res.data;
    } catch (error) {
      console.log("GET CUSTOMERS FOR COMPANY", error);
      return null;
    }
  };

  //Resources ------------------------------------------------------
  getMyResource = async () => {
    try {
      let res = await axios.get(this.API + "/getMyResource/");
      return res.data;
    } catch (error) {
      console.log("GET MY RESOURCE", error);
      return null;
    }
  };

  getResourcesForCompany = async () => {
    try {
      let res = await axios.get(this.API + "/resources/");
      return res.data;
    } catch (error) {
      console.log("GET RESOURCES FOR COMPANY", error);
      return null;
    }
  };

  getResourcesInProject = async (projectID) => {
    try {
      let res = await this.getResourcesForCompany();
      let final = [];
      res.forEach((resource) => {
        resource.projects.forEach((element) => {
          if (element.id == projectID) final.push(resource);
        });
      });
      return final;
    } catch (error) {
      console.log("GET RESOURCES FOR PROJECT", error);
    }
  };

  setResourcesForProject = async (projectID, resources) => {
    try {
      let toApply = [];
      resources.forEach((element) => {
        toApply.push(element.id);
      });
      let res = await axios.put(this.API + "/projects/" + projectID, {
        resources: toApply,
      });
      return res.data;
    } catch (error) {
      console.log("UPDATE RESOURCES", error);
      return null;
    }
  };

  getResourceTypes = async (projectId) => {
    try {
      let res = await axios.get(this.API + "/resource-types/");
      return res.data;
    } catch (error) {
      console.log("GET RESOURCE TYPES", error);
      return null;
    }
  };

  //Notes ---------------------------------------------------------
  createNote = async (taskID, workID, revisionID, text) => {
    try {
      let res = await axios.post(this.API + "/notes/", {
        task: taskID,
        work: workID,
        revision: revisionID,
        description: text,
      });
      return res.data;
    } catch (error) {
      console.log("CREATE NOTE", error);
    }
  };

  getNotesForTask = async (taskID) => {
    try {
      let res = await axios.get(this.API + "/notes-task/" + taskID);
      return res.data;
    } catch (error) {
      console.log("GET NOTES FOR TASK", error);
      return null;
    }
  };

  getNotesForWork = async (ID) => {
    try {
      let res = await axios.get(this.API + "/notes-work/" + ID);
      return res.data;
    } catch (error) {
      console.log("GET NOTES FOR WORK", error);
      return null;
    }
  };

  //Works ---------------------------------------------------------
  getWorkFromID = async (ID) => {
    try {
      let res = await axios.get(this.API + "/works/" + ID);
      return res.data;
    } catch (error) {
      console.log("GET WORK FROM ID", error);
    }
  };

  //Utils ---------------------------------------------------------
  difference = (a1, a2) => {
    var a2Set = new Set(a2);
    return a1.filter(function (x) {
      return !a2Set.has(x);
    });
  };

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  cleanString(text, maxChar) {
    if (text && text.length > 0)
      return text.replace(/(<([^>]+)>)/gi, "").length > maxChar
        ? text.replace(/(<([^>]+)>)/gi, "").substring(0, maxChar - 3) + "..."
        : text.replace(/(<([^>]+)>)/gi, "");
    else return "";
  }
}

const operations = new Operations();
export default operations;
