export const routers = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        name: '首页',
        path: '/home',
        component: './Home',
    },
    {
        path: '/pkg/*',
        microApp: 'pkg'
    },
    {
        name: '权限演示',
        path: '/pkg/*/access',
    },
    {
        name: ' CRUD 示例',
        path: '/pkg/*/table',
    },
]

function mergePath(paterPath = '', path = '') {
    if (!path && !paterPath) return '';
    if (!path) return paterPath;
    if (!paterPath) return path;
    path = path.replace(/^\//, '');
    paterPath = paterPath.replace(/\/$/, '');
    return `${paterPath}/${path}`;
}

const traverseRoutes = (routes: any[], upperPath: string, subRoutes: any[]) => {
    const items: any = [];

    routes.forEach((route) => {
        const thisPath = mergePath(upperPath, route.path);

        route.absolutePath = thisPath;
        route.subRoutes = [];

        if (route.routes && route.routes.length > 0) {
            route.routes = traverseRoutes(route.routes, thisPath, route.subRoutes);
        } else {
            subRoutes.push(route);
        }
        items.push(route);
    });
    return items;
};

export const adminRoutesWithAbsolutePath = traverseRoutes(routers, '', []);

export const findAdminRouteByUrl = (url: string) => {
    function find(routes:any): any {
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            if (route.absolutePath === url) {
                return route;
            }
            if (route.routes && route.routes.length > 0) {
                const res = find(route.routes);

                if (res) {
                    return res;
                }
            }
        }
    }

    return find(adminRoutesWithAbsolutePath);
};