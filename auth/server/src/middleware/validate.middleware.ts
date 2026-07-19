import type { RequestHandler } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";
import type { ZodType } from "zod";

type RequestSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};

const replaceRequestProperty = <T>(req: object, key: "params" | "query", value: T) => {
  Object.defineProperty(req, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
};

export const validate = (schemas: RequestSchemas): RequestHandler => {
  return (req, _res, next) => {
    if (schemas.body) {
      req.body = schemas.body.parse(req.body);
    }

    if (schemas.params) {
      replaceRequestProperty(req, "params", schemas.params.parse(req.params) as ParamsDictionary);
    }

    if (schemas.query) {
      replaceRequestProperty(req, "query", schemas.query.parse(req.query) as ParsedQs);
    }

    next();
  };
};
