import exp from "constants";
import { apiFunctions } from "./provider";

const { get, post, put, del } = apiFunctions;

export const getArticles = async () => {
  return await get("/articles?username=rhaqim");
}

export const getArticle = async (id: string) => {
  return await get(`/articles/${id}`);
}