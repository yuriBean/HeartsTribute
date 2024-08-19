import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context
const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);

  async function fetchSignedUrl() {
    const response = await fetch('https://api.globalgiving.org/api/public/projectservice/all/projects/active/download.xml?api_key=effb307b-a845-4e62-8146-2300502217ac');
    const data = await response.json();
    return data.url; // Assuming the URL is returned in a key called 'url'
  }
  async function fetchAndParseXml(xmlUrl) {
    const response = await fetch(xmlUrl);
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Extract project IDs and names
    const projects = Array.from(xmlDoc.getElementsByTagName('project')).map(project => ({
      id: project.getElementsByTagName('id')[0].textContent,
      name: project.getElementsByTagName('title')[0].textContent
    }));
  
    console.log('Parsed Projects:', projects); // Debugging line
    return projects;
    }
  useEffect(() => {
    const fetchAndStoreProjects = async () => {
      const cachedProjects = JSON.parse(localStorage.getItem('projects'));
      const lastFetch = localStorage.getItem('lastFetch');
      const oneDay = 24 * 60 * 60 * 1000;

      if (cachedProjects && lastFetch && (Date.now() - lastFetch < oneDay)) {
        setProjects(cachedProjects);
      } else {
        const signedUrl = await fetchSignedUrl();
        const projectData = await fetchAndParseXml(signedUrl);
        setProjects(projectData);
        localStorage.setItem('projects', JSON.stringify(projectData));
        localStorage.setItem('lastFetch', Date.now());
      }
    };

    fetchAndStoreProjects();
  }, []);

  return (
    <ProjectContext.Provider value={projects}>
      {children}
    </ProjectContext.Provider>
  );
};

// Hook to use the ProjectContext
export const useProjects = () => useContext(ProjectContext);
