import { NEIGHBORHOODS } from "@/lib/local";

export type Neighborhood =
  | "عدن كريتر"
  | "كريتر"
  | "خور مكسر"
  | "المعلا"
  | "التواهي"
  | "الشيخ عثمان"
  | "المنصورة"
  | "دار سعد"
  | "البريقة";

// Re-export types for other components
export { NEIGHBORHOODS };

// Types
export type ReportStatus = "available" | "outage" | "unstable";
export type ServiceType = "electricity" | "water" | "internet" | "gas" | "other";

export interface CommunityReport {
  id: string;
  serviceType: ServiceType;
  neighborhood: Neighborhood;
  status: ReportStatus;
  timestamp: string;
  reporter: string;
  description?: string;
  verified: boolean;
  upvotes: number;
  downvotes: number;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  attachments?: string[]; // URLs to images or documents
  tags?: string[];
}

export interface ReportStats {
  totalReports: number;
  verifiedReports: number;
  averageRating: number;
  mostReportedNeighborhood: Neighborhood | null;
  mostReportedService: ServiceType | null;
  recentActivity: number; // reports in last 24 hours
}

export interface ReportFilters {
  serviceType?: ServiceType;
  neighborhood?: Neighborhood;
  status?: ReportStatus;
  verified?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  reporter?: string;
}

// Storage keys
const STORAGE_KEYS = {
  REPORTS: "community-reports",
  USER_PREFERENCES: "community-user-preferences",
  REPORT_STATS: "community-report-stats",
  VERIFIED_REPORTS: "community-verified-reports"
} as const;

// Default data
const DEFAULT_REPORTS: CommunityReport[] = [
  {
    id: "1",
    serviceType: "electricity",
    neighborhood: "عدن كريتر",
    status: "unstable",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    reporter: "أحمد محمد",
    description: "الكهرباء متذبذبة منذ الصباح، تنقطع كل ساعة تقريباً",
    verified: true,
    upvotes: 5,
    downvotes: 0,
    tags: ["انقطاع متكرر", "جهد ضعيف"]
  },
  {
    id: "2",
    serviceType: "water",
    neighborhood: "خور مكسر",
    status: "outage",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    reporter: "فاطمة علي",
    description: "انقطاع المياه منذ أمس، لا يوجد ماء في المنطقة",
    verified: true,
    upvotes: 8,
    downvotes: 1,
    tags: ["انقطاع كامل", "مشكلة في الشبكة"]
  },
  {
    id: "3",
    serviceType: "electricity",
    neighborhood: "المعلا",
    status: "available",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    reporter: "محمد سالم",
    description: "الكهرباء متوفرة وجيدة في المنطقة",
    verified: false,
    upvotes: 3,
    downvotes: 0,
    tags: ["جهد جيد", "مستقر"]
  }
];

// Utility functions
export const generateReportId = (): string => {
  return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "الآن";
  if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
  if (diffHours < 24) return `منذ ${diffHours} ساعة`;
  if (diffDays < 7) return `منذ ${diffDays} يوم`;
  
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export const getStatusIcon = (status: ReportStatus): string => {
  const icons = {
    available: "🟢",
    outage: "🔴",
    unstable: "🟡"
  };
  return icons[status];
};

export const getStatusText = (status: ReportStatus): string => {
  const texts = {
    available: "متوفرة",
    outage: "مقطوعة",
    unstable: "متذبذبة"
  };
  return texts[status];
};

export const getStatusColor = (status: ReportStatus): string => {
  const colors = {
    available: "bg-green-100 text-green-800 border-green-200",
    outage: "bg-red-100 text-red-800 border-red-200",
    unstable: "bg-yellow-100 text-yellow-800 border-yellow-200"
  };
  return colors[status];
};

export const getServiceIcon = (serviceType: ServiceType): string => {
  const icons = {
    electricity: "⚡",
    water: "💧",
    internet: "🌐",
    gas: "🔥",
    other: "🔧"
  };
  return icons[serviceType];
};

export const getServiceText = (serviceType: ServiceType): string => {
  const texts = {
    electricity: "كهرباء",
    water: "مياه",
    internet: "إنترنت",
    gas: "غاز",
    other: "أخرى"
  };
  return texts[serviceType];
};

// Storage functions
export const getStoredReports = (): CommunityReport[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with default data
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(DEFAULT_REPORTS));
    return DEFAULT_REPORTS;
  } catch (error) {
    console.error("Error loading reports:", error);
    return DEFAULT_REPORTS;
  }
};

export const saveReports = (reports: CommunityReport[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  } catch (error) {
    console.error("Error saving reports:", error);
  }
};

export const addReport = (report: Omit<CommunityReport, "id" | "timestamp" | "verified" | "upvotes" | "downvotes">): CommunityReport => {
  const newReport: CommunityReport = {
    ...report,
    id: generateReportId(),
    timestamp: new Date().toISOString(),
    verified: false,
    upvotes: 0,
    downvotes: 0
  };

  const reports = getStoredReports();
  const updatedReports = [newReport, ...reports];
  saveReports(updatedReports);
  
  return newReport;
};

export const updateReport = (reportId: string, updates: Partial<CommunityReport>): CommunityReport | null => {
  const reports = getStoredReports();
  const reportIndex = reports.findIndex(r => r.id === reportId);
  
  if (reportIndex === -1) return null;
  
  const updatedReport = { ...reports[reportIndex], ...updates };
  reports[reportIndex] = updatedReport;
  saveReports(reports);
  
  return updatedReport;
};

export const deleteReport = (reportId: string): boolean => {
  const reports = getStoredReports();
  const filteredReports = reports.filter(r => r.id !== reportId);
  
  if (filteredReports.length === reports.length) return false;
  
  saveReports(filteredReports);
  return true;
};

export const voteOnReport = (reportId: string, voteType: "upvote" | "downvote"): CommunityReport | null => {
  const reports = getStoredReports();
  const reportIndex = reports.findIndex(r => r.id === reportId);
  
  if (reportIndex === -1) return null;
  
  const report = reports[reportIndex];
  const updatedReport = {
    ...report,
    upvotes: voteType === "upvote" ? report.upvotes + 1 : report.upvotes,
    downvotes: voteType === "downvote" ? report.downvotes + 1 : report.downvotes
  };
  
  reports[reportIndex] = updatedReport;
  saveReports(reports);
  
  return updatedReport;
};

// Filtering and searching
export const filterReports = (reports: CommunityReport[], filters: ReportFilters): CommunityReport[] => {
  return reports.filter(report => {
    if (filters.serviceType && report.serviceType !== filters.serviceType) return false;
    if (filters.neighborhood && report.neighborhood !== filters.neighborhood) return false;
    if (filters.status && report.status !== filters.status) return false;
    if (filters.verified !== undefined && report.verified !== filters.verified) return false;
    if (filters.reporter && !report.reporter.toLowerCase().includes(filters.reporter.toLowerCase())) return false;
    
    if (filters.dateRange) {
      const reportDate = new Date(report.timestamp);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      if (reportDate < startDate || reportDate > endDate) return false;
    }
    
    return true;
  });
};

export const searchReports = (reports: CommunityReport[], query: string): CommunityReport[] => {
  if (!query.trim()) return reports;
  
  const searchTerm = query.toLowerCase();
  return reports.filter(report => 
    report.description?.toLowerCase().includes(searchTerm) ||
    report.reporter.toLowerCase().includes(searchTerm) ||
    report.neighborhood.toLowerCase().includes(searchTerm) ||
    getServiceText(report.serviceType).toLowerCase().includes(searchTerm) ||
    getStatusText(report.status).toLowerCase().includes(searchTerm) ||
    report.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

// Statistics
export const getReportStats = (): ReportStats => {
  const reports = getStoredReports();
  const now = new Date();
  const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const verifiedReports = reports.filter(r => r.verified);
  const recentReports = reports.filter(r => new Date(r.timestamp) > last24Hours);
  
  // Most reported neighborhood
  const neighborhoodCounts = reports.reduce((acc, report) => {
    acc[report.neighborhood] = (acc[report.neighborhood] || 0) + 1;
    return acc;
  }, {} as Record<Neighborhood, number>);
  
  const mostReportedNeighborhood = Object.entries(neighborhoodCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] as Neighborhood || null;
  
  // Most reported service
  const serviceCounts = reports.reduce((acc, report) => {
    acc[report.serviceType] = (acc[report.serviceType] || 0) + 1;
    return acc;
  }, {} as Record<ServiceType, number>);
  
  const mostReportedService = Object.entries(serviceCounts)
    .sort(([,a], [,b]) => b - a)[0]?.[0] as ServiceType || null;
  
  // Average rating (based on upvotes vs downvotes)
  const totalVotes = reports.reduce((sum, report) => sum + report.upvotes + report.downvotes, 0);
  const totalUpvotes = reports.reduce((sum, report) => sum + report.upvotes, 0);
  const averageRating = totalVotes > 0 ? (totalUpvotes / totalVotes) * 5 : 0;
  
  return {
    totalReports: reports.length,
    verifiedReports: verifiedReports.length,
    averageRating: Math.round(averageRating * 10) / 10,
    mostReportedNeighborhood,
    mostReportedService,
    recentActivity: recentReports.length
  };
};

// Neighborhood-specific functions
export const getNeighborhoodReports = (neighborhood: Neighborhood): CommunityReport[] => {
  const reports = getStoredReports();
  return reports.filter(r => r.neighborhood === neighborhood);
};

export const getNeighborhoodStatus = (neighborhood: Neighborhood, serviceType: ServiceType): ReportStatus | null => {
  const reports = getNeighborhoodReports(neighborhood)
    .filter(r => r.serviceType === serviceType)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  if (reports.length === 0) return null;
  
  // Return the most recent report status
  return reports[0].status;
};

export const getNeighborhoodStats = (neighborhood: Neighborhood) => {
  const reports = getNeighborhoodReports(neighborhood);
  const serviceStats = reports.reduce((acc, report) => {
    if (!acc[report.serviceType]) {
      acc[report.serviceType] = { total: 0, available: 0, outage: 0, unstable: 0 };
    }
    acc[report.serviceType].total++;
    acc[report.serviceType][report.status]++;
    return acc;
  }, {} as Record<ServiceType, { total: number; available: number; outage: number; unstable: number }>);
  
  return {
    totalReports: reports.length,
    serviceStats,
    lastUpdate: reports.length > 0 ? reports[0].timestamp : null
  };
};

// Export/Import functions
export const exportReports = (format: "json" | "csv" = "json"): string => {
  const reports = getStoredReports();
  
  if (format === "json") {
    return JSON.stringify(reports, null, 2);
  }
  
  // CSV format
  const headers = [
    "ID", "Service Type", "Neighborhood", "Status", "Timestamp", 
    "Reporter", "Description", "Verified", "Upvotes", "Downvotes", "Tags"
  ];
  
  const rows = reports.map(report => [
    report.id,
    getServiceText(report.serviceType),
    report.neighborhood,
    getStatusText(report.status),
    report.timestamp,
    report.reporter,
    report.description || "",
    report.verified ? "Yes" : "No",
    report.upvotes.toString(),
    report.downvotes.toString(),
    report.tags?.join(", ") || ""
  ]);
  
  return [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(","))
    .join("\n");
};

export const importReports = (data: string, format: "json" | "csv" = "json"): boolean => {
  try {
    let reports: CommunityReport[];
    
    if (format === "json") {
      reports = JSON.parse(data);
    } else {
      // CSV parsing (simplified)
      const lines = data.split("\n");
      const headers = lines[0].split(",").map(h => h.replace(/"/g, ""));
      reports = lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.replace(/"/g, ""));
        const report: any = {};
        headers.forEach((header, index) => {
          report[header.toLowerCase().replace(" ", "")] = values[index];
        });
        return report as CommunityReport;
      });
    }
    
    // Validate reports
    if (!Array.isArray(reports)) return false;
    
    // Save imported reports
    saveReports(reports);
    return true;
  } catch (error) {
    console.error("Error importing reports:", error);
    return false;
  }
};

// Cleanup functions
export const cleanupOldReports = (daysToKeep: number = 30): number => {
  const reports = getStoredReports();
  const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);
  
  const filteredReports = reports.filter(report => 
    new Date(report.timestamp) > cutoffDate || report.verified
  );
  
  const removedCount = reports.length - filteredReports.length;
  saveReports(filteredReports);
  
  return removedCount;
};

export const clearAllReports = (): void => {
  localStorage.removeItem(STORAGE_KEYS.REPORTS);
};

// Validation functions
export const validateReport = (report: Partial<CommunityReport>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!report.serviceType) errors.push("نوع الخدمة مطلوب");
  if (!report.neighborhood) errors.push("المنطقة مطلوبة");
  if (!report.status) errors.push("حالة الخدمة مطلوبة");
  if (!report.reporter?.trim()) errors.push("اسم المبلغ مطلوب");
  
  if (report.reporter && report.reporter.length < 2) {
    errors.push("اسم المبلغ يجب أن يكون على الأقل حرفين");
  }
  
  if (report.description && report.description.length > 500) {
    errors.push("الوصف يجب أن يكون أقل من 500 حرف");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// إنشاء تقارير تجريبية لجميع المديريات
export const generateSampleReports = (): void => {
  const existingReports = getStoredReports();
  
  // إذا كانت هناك تقارير موجودة، لا نضيف تقارير تجريبية
  if (existingReports.length > 0) {
    return;
  }

  const sampleReports: CommunityReport[] = [
    // تقارير كريتر
    {
      id: "1",
      serviceType: "electricity",
      neighborhood: "كريتر",
      status: "outage",
      timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(), // منذ 4 دقائق
      reporter: "أحمد محمد",
      verified: true,
      upvotes: 5,
      downvotes: 0
    },
    {
      id: "2",
      serviceType: "other",
      neighborhood: "كريتر",
      status: "outage",
      timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      reporter: "فاطمة علي",
      verified: true,
      upvotes: 3,
      downvotes: 0
    },
    {
      id: "3",
      serviceType: "electricity",
      neighborhood: "كريتر",
      status: "outage",
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // منذ ساعة
      reporter: "محمد حسن",
      verified: true,
      upvotes: 7,
      downvotes: 1
    },
    {
      id: "4",
      serviceType: "electricity",
      neighborhood: "المعلا",
      status: "available",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // منذ يوم
      reporter: "سارة أحمد",
      verified: true,
      upvotes: 4,
      downvotes: 0
    },
    // تقارير المنصورة
    {
      id: "5",
      serviceType: "water",
      neighborhood: "المنصورة",
      status: "available",
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // منذ دقيقتين
      reporter: "عبدالله سالم",
      verified: true,
      upvotes: 6,
      downvotes: 0
    },
    {
      id: "6",
      serviceType: "electricity",
      neighborhood: "المنصورة",
      status: "outage",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // منذ 30 دقيقة
      reporter: "نور الدين",
      verified: true,
      upvotes: 8,
      downvotes: 1
    },
    // تقارير التواهي
    {
      id: "7",
      serviceType: "water",
      neighborhood: "التواهي",
      status: "available",
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // منذ 15 دقيقة
      reporter: "خالد يوسف",
      verified: true,
      upvotes: 5,
      downvotes: 0
    },
    {
      id: "8",
      serviceType: "other",
      neighborhood: "التواهي",
      status: "outage",
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // منذ 45 دقيقة
      reporter: "مريم عبدالله",
      verified: true,
      upvotes: 4,
      downvotes: 0
    },
    // تقارير خور مكسر
    {
      id: "9",
      serviceType: "electricity",
      neighborhood: "خور مكسر",
      status: "available",
      timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // منذ 10 دقائق
      reporter: "عبدالرحمن أحمد",
      verified: true,
      upvotes: 7,
      downvotes: 0
    },
    {
      id: "10",
      serviceType: "water",
      neighborhood: "خور مكسر",
      status: "outage",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // منذ 3 ساعات
      reporter: "فاطمة محمد",
      verified: true,
      upvotes: 9,
      downvotes: 1
    },
    // تقارير الشيخ عثمان
    {
      id: "11",
      serviceType: "electricity",
      neighborhood: "الشيخ عثمان",
      status: "available",
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // منذ 20 دقيقة
      reporter: "أحمد علي",
      verified: true,
      upvotes: 6,
      downvotes: 0
    },
    {
      id: "12",
      serviceType: "other",
      neighborhood: "الشيخ عثمان",
      status: "outage",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // منذ ساعتين
      reporter: "سعد الدين",
      verified: true,
      upvotes: 5,
      downvotes: 0
    },
    // تقارير البريقة
    {
      id: "13",
      serviceType: "water",
      neighborhood: "البريقة",
      status: "available",
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // منذ 5 دقائق
      reporter: "محمد عبدالله",
      verified: true,
      upvotes: 8,
      downvotes: 0
    },
    {
      id: "14",
      serviceType: "electricity",
      neighborhood: "البريقة",
      status: "outage",
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // منذ ساعة ونصف
      reporter: "عائشة حسن",
      verified: true,
      upvotes: 7,
      downvotes: 1
    },
    // تقارير دار سعد
    {
      id: "15",
      serviceType: "other",
      neighborhood: "دار سعد",
      status: "available",
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // منذ 25 دقيقة
      reporter: "يوسف أحمد",
      verified: true,
      upvotes: 6,
      downvotes: 0
    },
    {
      id: "16",
      serviceType: "water",
      neighborhood: "دار سعد",
      status: "outage",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // منذ 4 ساعات
      reporter: "نورا محمد",
      verified: true,
      upvotes: 10,
      downvotes: 2
    }
  ];

  // حفظ التقارير التجريبية
  saveReports(sampleReports);
};