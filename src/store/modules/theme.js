export default {
    namespace: true,
    state: {
        colors: [
            {
                name: "红色主题",
                colorCode: "#952e3a"
            },
            {
                name: "黄色主题",
                colorCode: "#ce9335"
            },
            {
                name: "蓝色主题",
                colorCode: "#17507d"
            },
            {
                name: "黑色主题",
                colorCode: "#000000"
            },
            {
                name: "默认主题",
                colorCode: "#323232"
            }
        ],
        currentColor: {
            name: "默认主题",
            colorCode: "#323232"
        }
    },
    getters: {
        getColors(state) {
            return state.colors.map(color => color.name)
        },
        
    },
    mutations: {
        updateCurrentColor(state, val) {
            state.currentColor = val;
        }
    },
    actions: {
        updateCurrentColor(state, val) {
            state.commit("updateCurrentColor", val)
        }
    },
    modules: {
    }
}