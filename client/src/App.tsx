import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { JobsProvider } from "@/lib/JobsContext";
import { ThemeProvider } from "next-themes";
import { PerformanceOptimizer } from "@/components/PerformanceOptimizer";
import NavigationWrapper from "@/components/NavigationWrapper";
import "@/styles/brand-colors.css";
import "@/styles/swipe-navigation.css";

// Import performance testing in development
if (process.env.NODE_ENV === 'development') {
  import('@/utils/performanceTest');
}

// تحميل مباشر لجميع الصفحات لفتح سلس بدون رسائل تحميل
import Home from "@/pages/home";
import LoginPage from "@/pages/login";
import NotFound from "@/pages/not-found";
import CurrencyRates from "@/pages/currency-rates";
import NotificationsPage from "@/pages/notifications";
import ProfilePage from "@/pages/profile";
import SettingsPage from "@/pages/settings";

// Health pages
import HealthPage from "@/pages/health";
import HealthFacilitiesPage from "@/pages/health-facilities";
import HealthMapsPage from "@/pages/health-maps";
import HealthAppointmentsPage from "@/pages/health-appointments";
import PhoneConsultationPage from "@/pages/phone-consultation";
import HealthAlertsPage from "@/pages/health-alerts";
import HealthEvaluationPage from "@/pages/health-evaluation";
import HealthNewsPage from "@/pages/health-news";
import BloodBankPage from "@/pages/blood-bank";
import BloodRequestsPage from "@/pages/blood-requests";
import BloodDonorsPage from "@/pages/blood-donors";
import RegisterDonorPage from "@/pages/register-donor";

// Education pages
import EducationPage from "@/pages/education";
import UniversitiesDirectoryPage from "@/pages/universities-directory";
import SchoolsDirectoryPage from "@/pages/schools-directory";
import OnlineRegistrationPage from "@/pages/online-registration";
import ParentServicesPage from "@/pages/parent-services";
import DigitalLibraryPage from "@/pages/digital-library"; 
// import DigitalLibraryPageFlowbite from "@/pages/digital-library-flowbite-full"; // معطل مؤقتاً
import PrivateTutorsPage from "@/pages/private-tutors";
import EducationNewsPage from "@/pages/education-news";
import ScholarshipsPage from "@/pages/scholarships";
import SchoolTransportPage from "@/pages/school-transport";

// Water pages
import WaterPage from "@/pages/water";
import HomeTanksPage from "@/pages/water/home-tanks";
import AdminHomeTanksPage from "@/pages/admin-home-tanks";
import AdminDashboardPage from "@/pages/admin-dashboard";
import MobileTankersPage from "@/pages/water/mobile-tankers";
import ConsumptionCalculatorPage from "@/pages/water/consumption-calculator";
import WaterPointsPage from "@/pages/water/water-points";
import TankMaintenancePage from "@/pages/water/tank-maintenance";
import EmergencyPumpsPage from "@/pages/water/emergency-pumps";
import BulkWaterPage from "@/pages/water/bulk-water";

// Electricity pages
import ElectricityPage from "@/pages/electricity";
import ChargingPointsPage from "@/pages/electricity/charging-points";
import PowerConvertersPage from "@/pages/electricity/power-converters";
import ElectricianPage from "@/pages/electricity/electrician";
import ElectricityCalculatorPage from "@/pages/electricity/calculator";
import OutageTrackerPage from "@/pages/electricity/outage-tracker";

// Other service pages
import MapsPage from "@/pages/maps";
import EmergencyPage from "@/pages/emergency";
import AdenJobsPage from "@/pages/jobs/AdenJobsPage";
import FlightsPage from "@/pages/flights";
import MotorcycleTaxiPage from "@/pages/motorcycle-taxi";
import RestaurantsPage from "@/pages/restaurants";
import DonationsPage from "@/pages/donations";
import IdeasPage from "@/pages/ideas";
import HarajAdenPage from "@/pages/haraj-aden";
import DevelopmentServicesPage from "@/pages/development-services";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
      
      {/* Settings Routes */}
        <Route path="/notifications" component={NotificationsPage} />
        <Route path="/profile" component={ProfilePage} />
        <Route path="/settings" component={SettingsPage} />
      
      {/* Jobs Routes */}
      <Route path="/jobs" component={AdenJobsPage} />
      <Route path="/jobs/list" component={AdenJobsPage} />
      <Route path="/jobs/category/:category" component={AdenJobsPage} />
      {/* Health Routes */}
      <Route path="/health" component={HealthPage} />
      <Route path="/health-facilities" component={HealthFacilitiesPage} />
      <Route path="/health-maps" component={HealthMapsPage} />
      <Route path="/health-appointments" component={HealthAppointmentsPage} />
      <Route path="/phone-consultation" component={PhoneConsultationPage} />
      <Route path="/health-alerts" component={HealthAlertsPage} />
      <Route path="/health-evaluation" component={HealthEvaluationPage} />
      <Route path="/health-news" component={HealthNewsPage} />
      <Route path="/blood-bank" component={BloodBankPage} />
      <Route path="/blood-requests" component={BloodRequestsPage} />
      <Route path="/blood-donors" component={BloodDonorsPage} />
      <Route path="/register-donor" component={RegisterDonorPage} />
      
      {/* Education Routes */}
      <Route path="/education" component={EducationPage} />
      <Route path="/universities-directory" component={UniversitiesDirectoryPage} />
      <Route path="/schools-directory" component={SchoolsDirectoryPage} />
      <Route path="/online-registration" component={OnlineRegistrationPage} />
      <Route path="/parent-services" component={ParentServicesPage} />
      <Route path="/digital-library" component={DigitalLibraryPage} />
      {/* <Route path="/digital-library-new" component={DigitalLibraryPageFlowbite} /> */}
      <Route path="/private-tutors" component={PrivateTutorsPage} />
      <Route path="/education-news" component={EducationNewsPage} />
      <Route path="/scholarships" component={ScholarshipsPage} />
      <Route path="/school-transport" component={SchoolTransportPage} />
      
      {/* Water Routes */}
      <Route path="/water" component={WaterPage} />
      <Route path="/water/home-tanks" component={HomeTanksPage} />
      <Route path="/water/mobile-tankers" component={MobileTankersPage} />
      <Route path="/water/consumption-calculator" component={ConsumptionCalculatorPage} />
      <Route path="/water/water-points" component={WaterPointsPage} />
      <Route path="/water/tank-maintenance" component={TankMaintenancePage} />
      <Route path="/water/emergency-pumps" component={EmergencyPumpsPage} />
      <Route path="/water/bulk-water" component={BulkWaterPage} />
      {/* <Route path="/water/supplier/:supplierName" component={SupplierPage} /> تم حذف الملف */}
      
      {/* Electricity Routes */}
      <Route path="/electricity" component={ElectricityPage} />
      <Route path="/electricity/charging-points" component={ChargingPointsPage} />
      <Route path="/electricity/power-converters" component={PowerConvertersPage} />
      <Route path="/electricity/electrician" component={ElectricianPage} />
      <Route path="/electricity/calculator" component={ElectricityCalculatorPage} />
      <Route path="/electricity/outage-tracker" component={OutageTrackerPage} />
      
      {/* Other Services */}
      <Route path="/currency-rates" component={CurrencyRates} />
      <Route path="/flights" component={FlightsPage} />
      <Route path="/motorcycle-taxi" component={MotorcycleTaxiPage} />
      <Route path="/restaurants" component={RestaurantsPage} />
      <Route path="/donations" component={DonationsPage} />
      <Route path="/maps" component={MapsPage} />
      <Route path="/emergency" component={EmergencyPage} />
      <Route path="/ideas" component={IdeasPage} />
      <Route path="/haraj-aden" component={HarajAdenPage} />
      <Route path="/development-services" component={DevelopmentServicesPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/admin" component={AdminDashboardPage} />
      <Route path="/admin/home-tanks" component={AdminHomeTanksPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
        <PerformanceOptimizer>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange={false}
          >
                <JobsProvider>
                  <NavigationWrapper enableSwipeBack={false} enableHardwareBack={true} swipeDirection="right">
                    <div className="min-h-screen bg-background overflow-x-hidden" dir="rtl">
                        {/* غلاف عرض كامل مع حشوة جانبية موحّدة */}
                        <div className="app-container">
                          <Router />
                        </div>
                    </div>
                  </NavigationWrapper>
                </JobsProvider>
          </ThemeProvider>
        </PerformanceOptimizer>
    </QueryClientProvider>
  );
}

export default App;
