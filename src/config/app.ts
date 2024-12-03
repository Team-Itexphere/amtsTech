
export interface Screens {
    Dashboard: string;
    fleet: string;
    ServiceCall: string;
    Route: string;
    Settings: string;
    Customer: string
}

export interface Config {
    screens: Screens;
}

const screens: Screens = {
    Dashboard: "Dashboard",
    Route: "Route",
    ServiceCall: "ServiceCall",
    fleet: "Fleet",
    Settings: "Settings",
    Customer: "Customer",
};

const bottom_tabs = [
    {
        id: 0,
        label: screens.Dashboard,
    },
    {
        id: 1,
        label: screens.Route,
    },
    {
        id: 2,
        label: screens.ServiceCall,
    },
    {
        id: 3,
        label: screens.fleet,
    },
    {
        id: 4,
        label: screens.Settings,
    }
]


const appConfig: Config = {
    screens,
};

export { appConfig, screens, bottom_tabs };
