import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Users, UserCheck, CreditCard, CheckSquare, TrendingUp, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

type User = {
  id: string;
  name: string;
  role: "admin" | "manager" | "employee";
  email: string;
};

interface DashboardProps {
  currentUser: User;
}

// Mock data for charts
const employeesByRole = [
  { role: "Admin", count: 2 },
  { role: "Manager", count: 5 },
  { role: "Employee", count: 18 },
];

const monthlyRevenue = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 55000 },
  { month: "Jun", revenue: 67000 },
];

const tasksByStatus = [
  { status: "Completed", count: 45, color: "#22c55e" },
  { status: "In Progress", count: 23, color: "#3b82f6" },
  { status: "Pending", count: 12, color: "#f59e0b" },
  { status: "Overdue", count: 8, color: "#ef4444" },
];

const recentActivities = [
  { id: 1, action: "New employee added", user: "Sarah Johnson", time: "2 hours ago", type: "employee" },
  { id: 2, action: "Invoice #INV-001 paid", client: "Acme Corp", time: "4 hours ago", type: "billing" },
  { id: 3, action: "Task completed", task: "Website redesign", time: "6 hours ago", type: "task" },
  { id: 4, action: "New client registered", client: "Tech Solutions", time: "1 day ago", type: "client" },
];

export default function Dashboard({ currentUser }: DashboardProps) {
  const stats = [
    {
      title: "Total Employees",
      value: "25",
      change: "+2",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Clients",
      value: "42",
      change: "+5",
      trend: "up",
      icon: UserCheck,
      color: "text-green-600",
    },
    {
      title: "Monthly Revenue",
      value: "$67,000",
      change: "+12%",
      trend: "up",
      icon: CreditCard,
      color: "text-purple-600",
    },
    {
      title: "Pending Tasks",
      value: "23",
      change: "-3",
      trend: "down",
      icon: CheckSquare,
      color: "text-orange-600",
    },
  ];

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case "employee": return "bg-blue-100 text-blue-800";
      case "billing": return "bg-green-100 text-green-800";
      case "task": return "bg-purple-100 text-purple-800";
      case "client": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {currentUser.name}! Here's your business overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue trend over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tasks by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Status</CardTitle>
            <CardDescription>Current task distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tasksByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="count"
                    label={({ status, count }) => `${status}: ${count}`}
                  >
                    {tasksByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Distribution</CardTitle>
            <CardDescription>Employees by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={employeesByRole}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" />
                  <YAxis />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start justify-between space-x-3">
                  <div className="flex-1">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.user || activity.client || activity.task}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={`text-xs ${getActivityTypeColor(activity.type)}`}>
                      {activity.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
