const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  if (!repositories) {
    return response.status(404).send();
  }
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const {title, url, techs} = request.body;
  const repository = repositories.find(repo => repo.id === id);

  if (!repository){
    return response.status(404).json({ error: "Repository not found" });
  } else {
    repository.title = title;
    repository.url = url;
    repository.techs = techs;
    return response.status(201).json(repository);
  }

  
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const Index = repositories.findIndex(repo => repo.id === id);

  if (Index === -1) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(Index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const Index = repositories.findIndex(repository => repository.id === id);

  if (Index === -1) {
    return response.status(404).json({ error: "Repository not found" });
  }
  const likes = repositories[Index].likes+1;

  repositories[Index].likes = likes

  return response.status(200).json(repositories[Index]);
});

module.exports = app;
