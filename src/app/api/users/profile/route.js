import { NextResponse } from 'next/server';
import { getUserById, updateUser } from '@/data/mock-users';
import { getIGOTConfig, getAuthConfig, isDemo, isProduction } from '@/integrations/config';

export async function GET(request) {
  try {
    const user = getUserById('USR001');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const { password, ...safeUser } = user;

    const igotConfig = getIGOTConfig();
    const authConfig = getAuthConfig();

    const isIgotProduction = isProduction();
    const hasIgotCredentials = Boolean(igotConfig.clientId && igotConfig.clientSecret);
    const isIgotConnected = Boolean(isIgotProduction && hasIgotCredentials && safeUser.igotLearnerId);

    const isParichayConfigured = Boolean(authConfig.mode === 'parichay' && process.env.PARICHAY_CLIENT_ID);
    const isParichayConnected = Boolean(isParichayConfigured && safeUser.parichayId);

    const integrations = {
      environment: isIgotProduction ? 'production' : 'demo',
      isDemoMode: isDemo(),
      isProduction: isIgotProduction,
      parichay: {
        name: 'Parichay SSO',
        provider: 'National Informatics Centre (NIC)',
        status: isParichayConnected ? 'Connected' : 'Not Connected',
        connected: isParichayConnected,
        mode: authConfig.mode, // 'demo' | 'parichay'
        id: safeUser.parichayId || null,
        isConfigured: isParichayConfigured,
        badge: authConfig.mode === 'parichay' && isParichayConfigured ? 'REAL SSO MODE' : 'DEMO / MOCK AUTH',
        message: isParichayConnected
          ? `Authenticated via official Parichay SSO (${safeUser.parichayId})`
          : 'Available when SSO is configured'
      },
      igot: {
        name: 'iGOT Karmayogi',
        provider: 'Karmayogi Bharat / DoPT',
        status: isIgotConnected ? 'Connected' : 'Not Connected',
        connected: isIgotConnected,
        environment: igotConfig.environment, // 'demo' | 'production'
        activeProvider: isIgotProduction ? 'ProductioniGOTProvider' : 'MockiGOTProvider',
        hasCredentials: hasIgotCredentials,
        id: safeUser.igotLearnerId || null,
        badge: isIgotProduction ? 'REAL INTEGRATION MODE' : 'DEMO / MOCK MODE',
        message: isIgotConnected
          ? `Connected to official iGOT with Learner ID: ${safeUser.igotLearnerId}`
          : 'Official iGOT API credentials & configuration required (IGOT_CLIENT_ID, IGOT_CLIENT_SECRET, IGOT_API_BASE_URL)'
      }
    };

    return NextResponse.json({
      ...safeUser,
      integrations
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const {
      name,
      designation,
      department,
      ministry,
      organization,
      jobRole,
      currentAssignment,
      qualification,
      yearsOfService,
      location,
      skills
    } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    if (!designation || !designation.trim()) {
      return NextResponse.json({ error: 'Designation is required' }, { status: 400 });
    }
    if (!department || !department.trim()) {
      return NextResponse.json({ error: 'Department is required' }, { status: 400 });
    }

    const updates = {
      name: name.trim(),
      designation: designation.trim(),
      department: department.trim(),
      ministry: ministry ? ministry.trim() : 'Ministry of Statistics & Programme Implementation',
      organization: organization ? organization.trim() : 'National Statistical Office',
      jobRole: jobRole ? jobRole.trim() : '',
      currentAssignment: currentAssignment ? currentAssignment.trim() : '',
      qualification: qualification ? qualification.trim() : '',
      yearsOfService: yearsOfService !== undefined && yearsOfService !== '' ? Number(yearsOfService) : 0,
      location: location ? location.trim() : '',
      skills: Array.isArray(skills)
        ? skills
        : typeof skills === 'string'
          ? skills.split(',').map(s => s.trim()).filter(Boolean)
          : []
    };

    const updated = updateUser('USR001', updates);
    if (!updated) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    const { password, ...safeUser } = updated;
    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
