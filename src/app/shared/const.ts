/**
 * Constants declaration available for the shared components
 */
export const TOOLBAR_CONFIG: any = [
  [{ font: [] }],

  [{ size: ["small", false, "large", "huge"] }],
  ["bold", "italic", "underline", "strike"], // toggled buttons
  [{ color: [] }, { background: [] }],
  ["blockquote"],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction

  // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  // dropdown with defaults from theme

  [{ align: [] }],

  ["clean"], // remove formatting button

  ["link", "image", "video"] // link and image, video
];

export const CHART_CONFIG: any = {
  incConstants: {
    CLEAR: "clear",
    LEGENDCOLORS: [
      "#E0F1F6",
      "#A6D8E7",
      "#49AFD9",
      "#0179B8",
      "#004D8A",
      "#073159",
      "#073159"
    ],
    CHARTPROPERTIES: {
      TITLE: "Open Incidents",
      TYPE: "pieChart",
      HEIGHT: 240,
      DONUT: true,
      DONMUTRATIO: 0.65,
      LABELTHRESHHOLD: 0.01,
      LABELSUNBEAMLAYOUT: true,
      GROWONHOVER: true,
      SHOWLEGEND: false,
      SHOWLABELS: false,
      MARGIN: { top: 35, left: 0, bottom: 0, right: 0 },
      CHARTID: "incidentdata",
      RIGHTALIGN: false,
      ADDCLEARBTN: true
    }
  },

  overviewConstants: {
    CLEAR: "clear",
    LEGENDCOLORS: [
      "#E0F1F6",
      "#A6D8E7",
      "#49AFD9",
      "#0179B8",
      "#004D8A",
      "#073159",
      "#073159"
    ],
    CHARTPROPERTIES: {
      TITLE: "Open Incidents",
      TYPE: "pieChart",
      HEIGHT: 240,
      DONUT: true,
      DONMUTRATIO: 0.65,
      LABELTHRESHHOLD: 0.01,
      LABELSUNBEAMLAYOUT: true,
      GROWONHOVER: true,
      SHOWLEGEND: false,
      SHOWLABELS: false,
      MARGIN: { top: 35, left: 0, bottom: 0, right: 0 },
      CHARTID: "overviewdata",
      RIGHTALIGN: false,
      ADDCLEARBTN: true
    }
  },

  parkOccConstants: {
    LEGENDCOLORS: ["#E0F1F6", "#A6D8E7"],
    CHARTPROPERTIES: {
      TITLE: "Parkings",
      TYPE: "pieChart",
      HEIGHT: 185,
      DONUT: true,
      DONMUTRATIO: 0.65,
      LABELTHRESHHOLD: 0.01,
      LABELSUNBEAMLAYOUT: true,
      GROWONHOVER: true,
      SHOWLEGEND: false,
      SHOWLABELS: false,
      MARGIN: { top: 30, left: 0, bottom: 0, right: 0 },
      CHARTID: "parkingOccupancyData",
      RIGHTALIGN: true,
      ADDCLEARBTN: false
    }
  },
  vehTypeDistrData: {
    LEGENDCOLORS: ["#ECF7FA", "#CAE8F1", "#92CFE8"],
    CHARTPROPERTIES: {
      TITLE: "Vehicles",
      TYPE: "pieChart",
      HEIGHT: 165,
      DONUT: true,
      DONMUTRATIO: 0.65,
      LABELTHRESHHOLD: 0.01,
      LABELSUNBEAMLAYOUT: true,
      GROWONHOVER: true,
      SHOWLEGEND: false,
      SHOWLABELS: false,
      MARGIN: { top: 0, left: 0, bottom: 0, right: 0 },
      CHARTID: "vehTypeDistrData",
      RIGHTALIGN: true,
      ADDCLEARBTN: false
    }
  },
  incDistrByType: {
    LEGENDCOLORS: [
      "#E0F1F6",
      "#BAE0EC",
      "#49AFD9",
      "#0179B8",
      "#004D8A",
      "#003E79",
      "#09325A"
    ],
    CHARTPROPERTIES: {
      TITLE: "Open Incidents",
      TYPE: "pieChart",
      HEIGHT: 165,
      DONUT: true,
      DONMUTRATIO: 0.65,
      LABELTHRESHHOLD: 0.01,
      LABELSUNBEAMLAYOUT: true,
      GROWONHOVER: true,
      SHOWLEGEND: false,
      SHOWLABELS: false,
      MARGIN: { top: 0, left: 0, bottom: 0, right: 0 },
      CHARTID: "incDistrByType",
      RIGHTALIGN: true,
      ADDCLEARBTN: false
    }
  },
  incDistrByPrior: {
    LEGENDCOLORS: ["#FFF6BE", "#FFB46D", "#FF7B7B"],
    CHARTPROPERTIES: {
      TITLE: "Occurrences",
      TYPE: "pieChart",
      HEIGHT: 165,
      DONUT: true,
      DONMUTRATIO: 0.65,
      LABELTHRESHHOLD: 0.01,
      LABELSUNBEAMLAYOUT: true,
      GROWONHOVER: true,
      SHOWLEGEND: false,
      SHOWLABELS: false,
      MARGIN: { top: 0, left: 0, bottom: 0, right: 0 },
      CHARTID: "incDistrByPrior",
      RIGHTALIGN: true,
      ADDCLEARBTN: false
    }
  },
  tripStatus: {
    LEGENDCOLORS: ["#E0F1F6", "#A6D8E7"],
    CHARTPROPERTIES: {
      TITLE: "Total trips",
      TYPE: "pieChart",
      HEIGHT: 165,
      DONUT: true,
      DONMUTRATIO: 0.65,
      LABELTHRESHHOLD: 0.01,
      LABELSUNBEAMLAYOUT: true,
      GROWONHOVER: true,
      SHOWLEGEND: false,
      SHOWLABELS: false,
      MARGIN: { top: 0, left: 0, bottom: 0, right: 0 },
      CHARTID: "tripStatus",
      RIGHTALIGN: true,
      ADDCLEARBTN: false
    }
  },
  cabTypeDistr: {
    LEGENDCOLORS: ["#E0F1F6", "#A6D8E7"],
    CHARTPROPERTIES: {
      TITLE: "Vehicles",
      TYPE: "pieChart",
      HEIGHT: 165,
      DONUT: true,
      DONMUTRATIO: 0.65,
      LABELTHRESHHOLD: 0.01,
      LABELSUNBEAMLAYOUT: true,
      GROWONHOVER: true,
      SHOWLEGEND: false,
      SHOWLABELS: false,
      MARGIN: { top: 0, left: 0, bottom: 0, right: 0 },
      CHARTID: "cabTypeDistr",
      RIGHTALIGN: true,
      ADDCLEARBTN: false
    }
  },
  matTransStatus: {
    LEGENDCOLORS: ["#E0F1F6", "#A6D8E7"],
    CHARTPROPERTIES: {
      TITLE: "Transctions",
      TYPE: "pieChart",
      HEIGHT: 165,
      DONUT: true,
      DONMUTRATIO: 0.65,
      LABELTHRESHHOLD: 0.01,
      LABELSUNBEAMLAYOUT: true,
      GROWONHOVER: true,
      SHOWLEGEND: false,
      SHOWLABELS: false,
      MARGIN: { top: 0, left: 0, bottom: 0, right: 0 },
      CHARTID: "matTransStatus",
      RIGHTALIGN: true,
      ADDCLEARBTN: false
    }
  },
  matTransType: {
    LEGENDCOLORS: ["#E0F1F6", "#A6D8E7", "#49AFD9"],
    CHARTPROPERTIES: {
      TITLE: "Transctions",
      TYPE: "pieChart",
      HEIGHT: 165,
      DONUT: true,
      DONMUTRATIO: 0.65,
      LABELTHRESHHOLD: 0.01,
      LABELSUNBEAMLAYOUT: true,
      GROWONHOVER: true,
      SHOWLEGEND: false,
      SHOWLABELS: false,
      MARGIN: { top: 0, left: 0, bottom: 0, right: 0 },
      CHARTID: "matTransType",
      RIGHTALIGN: true,
      ADDCLEARBTN: false
    }
  },
  rateWiseDistr: {
    LEGENDCOLORS: ["#E0F1F6", "#A6D8E7", "#0179B8", "#49AFD9"],
    CHARTPROPERTIES: {
      TITLE: "Members",
      TYPE: "pieChart",
      HEIGHT: 165,
      DONUT: true,
      DONMUTRATIO: 0.65,
      LABELTHRESHHOLD: 0.01,
      LABELSUNBEAMLAYOUT: true,
      GROWONHOVER: true,
      SHOWLEGEND: false,
      SHOWLABELS: false,
      MARGIN: { top: 0, left: 0, bottom: 0, right: 0 },
      CHARTID: "rateWiseDistr",
      RIGHTALIGN: true,
      ADDCLEARBTN: false
    }
  },
  demoGraphDistr: {
    LEGENDCOLORS: ["#E0F1F6", "#A6D8E7", "#0179B8", "#49AFD9"],
    CHARTPROPERTIES: {
      TITLE: "Members",
      TYPE: "pieChart",
      HEIGHT: 165,
      DONUT: true,
      DONMUTRATIO: 0.65,
      LABELTHRESHHOLD: 0.01,
      LABELSUNBEAMLAYOUT: true,
      GROWONHOVER: true,
      SHOWLEGEND: false,
      SHOWLABELS: false,
      MARGIN: { top: 0, left: 0, bottom: 0, right: 0 },
      CHARTID: "demoGraphDistr",
      RIGHTALIGN: true,
      ADDCLEARBTN: false
    }
  }
};

export const WEB_TOKEN = "WEB";
export const ALL_SERVICE_TYPES = "All";
export const ALL_PARAMETER_TYPES = "All Parameters";
export const ISSUES_REPORTED = "Issues Reported";
export const WOMEN_PASSENGERS = "Women Passengers";
export const REGIONS = ["ALL REGIONS", "APAC", "AMER", "EMEA", "INDIA", "PALO ALTO"];
export const TIME_RANGES = ["All Time", "Today", "This Week", "This Month"];
export const COMPLIANCE_TYPES = [
  {
    displayString: "All Tasks",
    value: "All"
  },
  {
    displayString: "PV Expired",
    value: "Expired"
  },
  {
    displayString: "PV Pending",
    value: "Pending"
  },
  {
    displayString: "PV Expiring In 30 Days",
    value: "Expiring_in_30_days"
  },
];

export const DAY_IN_MS = 86399000;