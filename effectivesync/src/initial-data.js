const initialData = {
  tasks: {
    "task-1": {
      id: "task-1",
      content: "Take out the garbage",
      priority: "HIGH",
      dueDate: "",
      image: "https://www.celoxis.com/cassets/img/pmc/project-management.png",
    },
    "task-2": {
      id: "task-2",
      content: "Watch my favorite show",
      priority: "MEDIUM",
      dueDate: "",
      image:
        "https://getnave.com/blog/wp-content/uploads/2018/01/what-is-project-management-process-1200x675.png",
    },
    "task-3": {
      id: "task-3",
      content: "Charge my phone",
      priority: "LOW",
      dueDate: "",
      image:
        "https://www.liquidplanner.com/wp-content/uploads/2019/04/HiRes-17.jpg",
    },
    "task-4": {
      id: "task-4",
      content: "Cook dinner",
      priority: "MEDIUM",
      dueDate: "",
      image:
        "https://getnave.com/blog/wp-content/uploads/2018/01/what-is-project-management-process-1200x675.png",
    },
    "task-5": {
      id: "task-5",
      content: "Charge my mac",
      priority: "HIGH",
      dueDate: "",
      image:
        "https://cdn-cashy-static-assets.lucidchart.com/marketing/blog/2017Q3/phases-project-management-lifecycle/phases-project-management-lifecycle-header.png",
    },
  },

  columns: {
    "column-1": {
      id: "column-1",
      title: "To do",
      taskIds: ["task-1", "task-3"],
    },

    "column-2": {
      id: "column-2",
      title: "things being done",
      taskIds: ["task-4"],
    },

    "column-3": {
      id: "column-3",
      title: "are already done",
      taskIds: ["task-5", "task-2"],
    },
  },

  columnOrder: ["column-1", "column-2", "column-3"],
};

export default initialData;
