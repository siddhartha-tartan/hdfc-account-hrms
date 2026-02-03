import { NextResponse } from "next/server";

type JourneyType = "ntb" | "etb-nk" | "etb" | "journey2";

export interface InviteRecord {
  id: string;
  employee: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  journeyType: JourneyType;
  prefilledData: Record<string, unknown>;
  status: "sent" | "opened" | "started" | "completed";
  createdAt: string; // ISO
  lastUpdatedAt: string; // ISO
}

declare global {
  // eslint-disable-next-line no-var
  var __hdfcInvitesStore: Map<string, InviteRecord> | undefined;
}

function getStore(): Map<string, InviteRecord> {
  if (!globalThis.__hdfcInvitesStore) {
    globalThis.__hdfcInvitesStore = new Map<string, InviteRecord>();
  }
  return globalThis.__hdfcInvitesStore;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const journeyType = body?.journeyType as JourneyType | undefined;
  const employee = body?.employee as InviteRecord["employee"] | undefined;
  const prefilledData = (body?.prefilledData ?? {}) as Record<string, unknown>;

  if (!journeyType || !employee?.id || !employee?.name || !employee?.email) {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }

  const inviteId = crypto.randomUUID();
  const now = new Date().toISOString();

  const record: InviteRecord = {
    id: inviteId,
    employee: {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
    },
    journeyType,
    prefilledData,
    status: "sent",
    createdAt: now,
    lastUpdatedAt: now,
  };

  getStore().set(inviteId, record);

  const origin = new URL(req.url).origin;
  const journeyUrl = `${origin}/journey/${encodeURIComponent(inviteId)}`;

  return NextResponse.json({ inviteId, journeyUrl });
}

