import axios from "axios";
import type { Job, JobSummary, AnalysisResult, ChainVerification } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5000",
});

export const uploadFile = async (file: File): Promise<Job> => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<Job>("/api/uploads", form);
  return data;
};

export const getJobs = async (): Promise<Job[]> => {
  const { data } = await api.get<Job[]>("/api/jobs");
  return data;
};

export const getJob = async (id: string): Promise<Job> => {
  const { data } = await api.get<Job>(`/api/jobs/${id}`);
  return data;
};

export const getJobSummary = async (id: string): Promise<JobSummary> => {
  const { data } = await api.get<JobSummary>(`/api/jobs/${id}/summary`);
  return data;
};

export const getResults = async (id: string): Promise<AnalysisResult[]> => {
  const { data } = await api.get<AnalysisResult[]>(`/api/jobs/${id}/results`);
  return data;
};

export const getTopComments = async (id: string): Promise<AnalysisResult[]> => {
  const { data } = await api.get<AnalysisResult[]>(`/api/jobs/${id}/top-comments`);
  return data;
};

export const verifyChain = async (id: string): Promise<ChainVerification> => {
  const { data } = await api.get<ChainVerification>(`/api/jobs/${id}/verify-chain`);
  return data;
};

export const getReportUrl = (id: string): string =>
  `${api.defaults.baseURL}/api/jobs/${id}/report`;
