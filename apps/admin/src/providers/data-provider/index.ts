"use client";

// const BACKEND_API_URL = "http://localhost:3000";
// export const LOCAL_API_URL = "http://localhost:3001/api";
const BACKEND_API_URL = "https://backend.gopark.app.br";
export const LOCAL_API_URL = "https://bee-dash-refine.vercel.app/api";

import type { DataProvider } from "@refinedev/core";

export const dataProvider: DataProvider = {
  getOne: async ({ resource, id, meta }) => {
    const response = await fetch(`${BACKEND_API_URL}/${resource}/${id}`);

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  update: async ({ resource, id, variables }) => {
    const response = await fetch(`${BACKEND_API_URL}/${resource}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(variables),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const params = new URLSearchParams();

    if (pagination) {
      params.append(
        "_start",
        `${((pagination.current ?? 1) - 1) * (pagination.pageSize ?? 10)}`
      );
      params.append(
        "_end",
        `${(pagination.current ?? 1) * (pagination.pageSize ?? 10)}`
      );
    }

    if (sorters && sorters.length > 0) {
      params.append("_sort", sorters.map((sorter) => sorter.field).join(","));
      params.append("_order", sorters.map((sorter) => sorter.order).join(","));
    }

    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if ("field" in filter && filter.operator === "contains") {
          // Our fake API supports "eq" operator by simply appending the field name and value to the query string.
          params.append(filter.field, filter.value);
        }
      });
    }

    if (resource === "attachments" || resource === "posts") {
      const response = await fetch(
        `${BACKEND_API_URL}/${resource}/all?${
          meta?.email ? `email=${meta?.email}&` : ""
        }${params.toString()}`
      );

      if (response.status < 200 || response.status > 299) throw response;

      const { result, total } = await response.json();

      return {
        data: result,
        total,
      };
    }
    const response = await fetch(
      `${BACKEND_API_URL}/${resource}?${params.toString()}`
    );

    if (response.status < 200 || response.status > 299) throw response;

    const { result, total } = await response.json();

    return {
      data: result,
      total,
    };
  },
  create: async ({ resource, variables }) => {
    const response = await fetch(`${BACKEND_API_URL}/${resource}`, {
      method: "POST",
      body: JSON.stringify(variables),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  deleteOne: async ({ resource, id, meta }) => {
    const response = await fetch(`${BACKEND_API_URL}/${resource}/${id}`, {
      method: "DELETE",
    });

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  getApiUrl: () => BACKEND_API_URL,
  // Optional methods:
  getMany: async ({ resource, ids, meta }) => {
    const params = new URLSearchParams();

    if (ids) {
      ids.forEach((id) => params.append("id", `${id}`));
    }

    const response = await fetch(
      `${BACKEND_API_URL}/${resource}?${params.toString()}`
    );

    if (response.status < 200 || response.status > 299) throw response;

    const data = await response.json();

    return { data };
  },
  // createMany: () => { /* ... */ },
  // deleteMany: () => { /* ... */ },
  // updateMany: () => { /* ... */ },
  // custom: () => { /* ... */ },
};
