/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Request, Response } from "express";
import type { ParamsDictionary, Send } from "express-serve-static-core";

export interface FormattedErrors {
  errors: string[];
  statusCode: number;
}

export interface RequestValidatedAPI<T = unknown, P extends ParamsDictionary = {}> extends RequestValidationAPI<T, P> {
  body: T;
}

export interface RequestValidationAPI<T = unknown, P extends ParamsDictionary = {}> extends Request {
  body: T | undefined;
  params: P;
}

export interface ResponseAPI<T = unknown> extends TypedResponse<{
  data?: T;
  errors?: string[];
  message: string;
  status: boolean;
}> {}

export interface ResponseFromApi<T> {
  data?: T;
  errors?: string[];
  message: string;
  status: boolean;
}

export interface TypedResponse<ResBody> extends Response {
  json: Send<ResBody, this>;
}
