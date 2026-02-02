
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { PropertiesPage } from './pages/Properties';
import { ClientsPage } from './pages/Clients';
import { MatchingPage } from './pages/Matching';
import { ReportsPage } from './pages/Reports';
import { SettingsPage } from './pages/Settings';
import { RemindersPage } from './pages/Reminders';
import { LoginPage } from './pages/Login';
import { SmartSearchModal } from './components/SmartSearchModal';
import { MOCK_PROPERTIES, MOCK_CLIENTS } from './mockData';
import { Property, Client, Reminder, ReminderStatus } from './types';

export enum NavigationTab {
  DASHBOARD = 'dashboard',
  PROPERTIES = 'properties',
  CLIENTS = 'clients',
  MATCHING = 'matching',
  REPORTS = 'reports',
  SETTINGS = 'settings',
  REMINDERS = 'reminders'
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<NavigationTab>(NavigationTab.DASHBOARD);
  const [modalTrigger, setModalTrigger] = useState<number>(0);
  const [isSmartSearchOpen, setIsSmartSearchOpen] = useState(false);
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [userPlan, setUserPlan] = useState<'Free' | 'Premium'>('Free');
  const [preselectedClient, setPreselectedClient] = useState<Client | null>(null);

  const getStorageKey = (base: string) => `propmate_${currentUserEmail?.replace(/[^a-zA-Z0-9]/g, '_')}_${base}`;

  useEffect(() => {
    if (isLoggedIn && currentUserEmail) {
      const savedProps = localStorage.getItem(getStorageKey('properties'));
      const savedClients = localStorage.getItem(getStorageKey('clients'));
      const savedReminders = localStorage.getItem(getStorageKey('reminders'));

      setProperties(savedProps ? JSON.parse(savedProps) : MOCK_PROPERTIES.map(p => ({...p, isFavorite: false, tenantId: currentUserEmail})));
      setClients(savedClients ? JSON.parse(savedClients) : MOCK_CLIENTS.map(c => ({...c, isFavorite: false, tenantId: currentUserEmail})));
      setReminders(savedReminders ? JSON.parse(savedReminders) : []);
      
      if (currentUserEmail === 'Piyushdidwania@gmail.com') {
        setUserPlan('Premium');
      }
    }
  }, [isLoggedIn, currentUserEmail]);

  useEffect(() => {
    if (isLoggedIn && currentUserEmail) {
      localStorage.setItem(getStorageKey('properties'), JSON.stringify(properties));
      localStorage.setItem(getStorageKey('clients'), JSON.stringify(clients));
      localStorage.setItem(getStorageKey('reminders'), JSON.stringify(reminders));
    }
  }, [properties, clients, reminders, isLoggedIn, currentUserEmail]);

  const handleLogin = (email: string) => {
    setCurrentUserEmail(email);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUserEmail(null);
    setActiveTab(NavigationTab.DASHBOARD);
    setProperties([]);
    setClients([]);
    setReminders([]);
  };

  const deleteProperty = (id: string) => setProperties(properties.filter(p => p.id !== id));
  const deleteClient = (id: string) => setClients(clients.filter(c => c.id !== id));
  const deleteReminder = (id: string) => setReminders(reminders.filter(r => r.id !== id));

  const updateProperty = (updated: Property) => setProperties(properties.map(p => p.id === updated.id ? updated : p));
  const updateClient = (updated: Client) => setClients(clients.map(c => c.id === updated.id ? updated : c));

  const toggleFavoriteProperty = (id: string) => {
    setProperties(properties.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };
  const toggleFavoriteClient = (id: string) => {
    setClients(clients.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
  };

  const addProperty = (prop: Property) => setProperties([{...prop, tenantId: currentUserEmail || ''}, ...properties]);
  const addClient = (client: Client) => setClients([{...client, tenantId: currentUserEmail || ''}, ...clients]);
  const addReminder = (rem: Reminder) => setReminders([rem, ...reminders]);

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { 
      ...r, 
      isCompleted: !r.isCompleted, 
      status: !r.isCompleted ? ReminderStatus.COMPLETED : ReminderStatus.PENDING 
    } : r));
  };
  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const handleSelectSearchResult = (type: 'property' | 'client', id: string) => {
    setIsSmartSearchOpen(false);
    if (type === 'property') {
      setActiveTab(NavigationTab.PROPERTIES);
    } else {
      setActiveTab(NavigationTab.CLIENTS);
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case NavigationTab.DASHBOARD:
        return <Dashboard 
          properties={properties} 
          clients={clients} 
          reminders={reminders} 
          onToggleReminder={toggleReminder} 
          onNavigate={(tab: NavigationTab) => setActiveTab(tab)}
        />;
      case NavigationTab.PROPERTIES:
        return <PropertiesPage 
          properties={properties} 
          onAdd={addProperty} 
          onUpdate={updateProperty}
          onDelete={deleteProperty}
          onToggleFavorite={toggleFavoriteProperty}
          triggerModal={modalTrigger}
        />;
      case NavigationTab.CLIENTS:
        return <ClientsPage 
          clients={clients} 
          onAdd={addClient} 
          onUpdate={updateClient}
          onDelete={deleteClient}
          onToggleFavorite={toggleFavoriteClient}
          onAutoMatch={(c) => { setPreselectedClient(c); setActiveTab(NavigationTab.MATCHING); }} 
          triggerModal={modalTrigger}
        />;
      case NavigationTab.MATCHING:
        return <MatchingPage properties={properties} clients={clients} initialClient={preselectedClient} />;
      case NavigationTab.REPORTS:
        return <ReportsPage properties={properties} clients={clients} reminders={reminders} />;
      case NavigationTab.SETTINGS:
        return <SettingsPage userPlan={userPlan} onUpgrade={() => setUserPlan('Premium')} onLogout={handleLogout} />;
      case NavigationTab.REMINDERS:
        return <RemindersPage 
          reminders={reminders} 
          clients={clients} 
          properties={properties} 
          onAdd={addReminder} 
          onToggle={toggleReminder} 
          onUpdate={updateReminder}
          onDelete={deleteReminder} 
          triggerModal={modalTrigger}
        />;
      default:
        return <Dashboard properties={properties} clients={clients} reminders={reminders} onToggleReminder={toggleReminder} onNavigate={(tab: any) => setActiveTab(tab)} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={(tab: any) => setActiveTab(tab)}
      userPlan={userPlan}
      onLogout={handleLogout}
      onGoProperties={() => setActiveTab(NavigationTab.PROPERTIES)}
      onGoClients={() => setActiveTab(NavigationTab.CLIENTS)}
      onGoMatching={() => setActiveTab(NavigationTab.MATCHING)}
      onGoReminders={() => setActiveTab(NavigationTab.REMINDERS)}
      onGoHome={() => setActiveTab(NavigationTab.DASHBOARD)}
      onGoReports={() => setActiveTab(NavigationTab.REPORTS)}
      onGoSettings={() => setActiveTab(NavigationTab.SETTINGS)}
      onOpenSmartSearch={() => setIsSmartSearchOpen(true)}
      reminders={reminders}
      userEmail={currentUserEmail || ''}
    >
      {renderContent()}
      
      {isSmartSearchOpen && (
        <SmartSearchModal 
          onClose={() => setIsSmartSearchOpen(false)}
          properties={properties}
          clients={clients}
          onSelectProperty={(p) => handleSelectSearchResult('property', p.id)}
          onSelectClient={(c) => handleSelectSearchResult('client', c.id)}
        />
      )}
    </Layout>
  );
};

export default App;
