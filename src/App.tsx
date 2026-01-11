import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import PropertyDetails from "./pages/PropertyDetails";
import Saved from "./pages/Saved";
import CreateListing from "./pages/CreateListing";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import PersonalInfo from "./pages/PersonalInfo";
import MyListings from "./pages/MyListings";
import PaymentMethods from "./pages/PaymentMethods";
import Notifications from "./pages/Notifications";
import PrivacySecurity from "./pages/PrivacySecurity";
import HelpSupport from "./pages/HelpSupport";
import MessageConversation from "./pages/MessageConversation";
import PropertyInspection from "./pages/PropertyInspection";
import InspectorProfile from "./pages/InspectorProfile";
import InspectorReviews from "./pages/InspectorReviews";
import InspectorDashboard from "./pages/InspectorDashboard";
import InspectorRegistration from "./pages/InspectorRegistration";
import InspectionRequestDetails from "./pages/InspectionRequestDetails";
import CategoryListing from "./pages/CategoryListing";
import CreateListingPage from "./pages/CreateListingPage";
import CreateServicePage from "./pages/CreateServicePage";
import CreateRentListingPage from "./pages/CreateRentListingPage";
import CreateSaleListingPage from "./pages/CreateSaleListingPage";
import CreateShortletListingPage from "./pages/CreateShortletListingPage";
import CreateEventCenterListingPage from "./pages/CreateEventCenterListingPage";
import CreateShopListingPage from "./pages/CreateShopListingPage";
import AdminLocationPage from "./pages/AdminLocationPage";
import DiagnosticPage from "./pages/DiagnosticPage";
import MapSearchPage from "./pages/MapSearchPage";
import LocationVisibilityPage from "./pages/LocationVisibilityPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Homes from "./pages/Homes";
import Shortlets from "./pages/Shortlets";
import Services from "./pages/Services";
import Rent from "./pages/Rent";
import Buy from "./pages/Buy";
import Land from "./pages/Land";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/homes" element={<Homes />} />
            <Route path="/shortlets" element={<Shortlets />} />
            <Route path="/services" element={<Services />} />
            <Route path="/rent" element={<Rent />} />
            <Route path="/buy" element={<Buy />} />
            <Route path="/land" element={<Land />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/create" element={<CreateListing />} />
            <Route path="/create-listing" element={<CreateListingPage />} />
            <Route path="/create-service" element={<CreateServicePage />} />
            <Route path="/create-rent-listing" element={<CreateRentListingPage />} />
            <Route path="/create-sale-listing" element={<CreateSaleListingPage />} />
            <Route path="/create-shortlet-listing" element={<CreateShortletListingPage />} />
            <Route path="/create-event-center-listing" element={<CreateEventCenterListingPage />} />
            <Route path="/create-shop-listing" element={<CreateShopListingPage />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:id" element={<MessageConversation />} />
            <Route path="/property-inspection/:id" element={<PropertyInspection />} />
            <Route path="/inspector/:id" element={<InspectorProfile />} />
            <Route path="/inspector/:id/reviews" element={<InspectorReviews />} />
            <Route path="/inspector-dashboard" element={<InspectorDashboard />} />
            <Route path="/inspector-registration" element={<InspectorRegistration />} />
            <Route path="/inspection-request/:id" element={<InspectionRequestDetails />} />
            <Route path="/category/:category" element={<CategoryListing />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/personal-info" element={<PersonalInfo />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/privacy-security" element={<PrivacySecurity />} />
            <Route path="/help-support" element={<HelpSupport />} />
            <Route path="/admin-locations" element={<AdminLocationPage />} />
            <Route path="/diagnostic" element={<DiagnosticPage />} />
            <Route path="/map-search" element={<MapSearchPage />} />
            <Route path="/location-visibility" element={<LocationVisibilityPage />} />
            <Route path="/search-results" element={<SearchResultsPage />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
