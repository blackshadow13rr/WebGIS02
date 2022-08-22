//路由器
import { createRouter, createWebHashHistory } from 'vue-router'

//定义路由信息
const routes = [
    //Index首页
    {
        path: "/",
        name: "Index",
        component: () =>
            import ("../views/Index.vue")
    },
    {
        path: "/login",
        name: "Login",
        component: () =>
            import ("../views/Login.vue")
    },
    {
        path: "/register",
        name: "Register",
        component: () =>
            import ("../views/Register.vue")
    },
    {
        path: "/Home",
        name: "Home",
        component: () =>
            import ("../views/Home.vue"),
        children: [{
                path: "role",
                name: "Role",
                component: () =>
                    import ("../views/role/Role.vue")
            },
            {
                path: "comments",
                name: "Comments",
                component: () =>
                    import ("../views/role/Comments.vue")
            },
            {
                path: "map",
                name: "Map",
                component: () =>
                    import ("../views/map/MapView.vue")
            },
            {
                path: "route",
                name: "Route",
                component: () =>
                    import ("../views/map/MapRoute.vue")
            },
            {
                path: "monitor",
                name: "Monitor",
                component: () =>
                    import ("../views/monitor/Monitor.vue")
            },
            {
                path: "activeLocus",
                name: "ActiveLocus",
                component: () =>
                    import ("../views/monitor/activeLocus.vue")
            },
            {
                path: "supply",
                name: "Supply",
                component: () =>
                    import ("../views/supply/Supply.vue")
            },
            {
                path: "order",
                name: "Order",
                component: () =>
                    import ("../views/supply/Order.vue"),
                children: [

                ]
            },
            {
                path: "closestFacility",
                name: "ClosestFacility",
                component: () =>
                    import ("../views/supply/ClosestFacility.vue")
            },
            {
                path: "serviceArea",
                name: "serviceArea",
                component: () =>
                    import ("../views/supply/serviceArea.vue")
            },
            {
                path: "hospital",
                name: "Hospital",
                component: () =>
                    import ("../views/hospital/Hospital.vue")
            },
            {
                path: "3D",
                name: "3D",
                component: () =>
                    import ("../views/map/3D.vue")
            },
            {
                path: "/Message",
                name: "Message",
                component: () =>
                    import ("../views/Message.vue")
            },
            {
                path: "Thiessen",
                name: "Thiessen",
                component: () =>
                    import ("../views/map/ThiessenPolygons.vue")
            },
            {
                path: "DensityAnalysis",
                name: "DensityAnalysis",
                component: () =>
                    import ("../views/map/DensityAnalysis.vue")
            },
            {
                path: "HeatMap",
                name: "HeatMap",
                component: () =>
                    import ("../views/map/HeatMap.vue")
            },
            {
                path: "HosOrder",
                name: "HosOrder",
                component: () =>
                    import ("../views/hospital/HosOrder.vue")
            },
            {
                path: "GradingSymbol",
                name: "GradingSymbol",
                component: () =>
                    import ("../views/hospital/GradingSymbol.vue")
            },
            {
                path: "TimeCube",
                name: "TimeCube",
                component: () =>
                    import ("../views/map/Timecube.vue")
            },
            {
                path: "tempPCRSpot",
                name: "tempPCRSpot",
                component: () =>
                    import ("../views/monitor/tempPCRSpot.vue")
            },
            {
                path: "Statistic",
                name: "Statistic",
                component: () =>
                    import ("../views/monitor/Statistic.vue")
            }, {
                path: "HighRisk",
                name: "HighRisk",
                component: () =>
                    import ("../views/monitor/HighRisk.vue")
            }, {
                path: "cluster",
                name: "cluster",
                component: () =>
                    import ("../views/monitor/cluster.vue")
            },
        ]
    },
    {
        path: "/TestMap",
        name: "testMap",
        component: () =>
            import ("../function/Map.vue")
    },
]

//创建路由器对象
export const router = createRouter({
    history: createWebHashHistory(),
    routes
})



//导入nprogress
import NProgress from "nprogress"
import "nprogress/nprogress.css"
//定义路由导航前置守卫
router.beforeEach((to, from, next) => {
        NProgress.start();
        next()
    })
    //定义路由导航后置守卫
router.afterEach((to, from) => {
    NProgress.done();
})


export default router