//开发不同的阶段对应不同的模式，有不同的接口地址
let model = {
    dev: "http://43.142.31.47:8081",
    /* dev: "http://localhost:8080", */
    test: "",
    pro: ""
}
export const BASE_URL = model.dev;