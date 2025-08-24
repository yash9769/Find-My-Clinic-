export interface ClinicStats {
  clinicsConnected: number;
  patientsServed: number;
  avgTimeSaved: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  badge: string;
  gradient: string;
}
