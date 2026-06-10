import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import {
    Alert,
} from 'react-native';

// Only initialize on native platforms
let db: SQLite.SQLiteDatabase | null = null;

try {
  if (Platform.OS !== 'web') {
    db = SQLite.openDatabaseSync('experiments.db');
  }
} catch (error) {
  console.error('Failed to open database:', error);
}

export interface PrototypeRecord {
  id?: number;
  session_id?: string;
  timestamp?: string;

  prototype_key: string;
  mass: number;
  height: number;

  video_uri: string;

  drop_time: number | null;
  hit_ground_time: number | null;
  bounce_time: number | null;
  stop_time: number | null;

  g_force: number;
  v_impact: number;
}

export interface HandFanPrototypeRecord {
  id?: number;
  session_id?: string;
  timestamp?: string;

  prototype_key: string;
  design: number;
  distance: number;
  material: string;
  stiffness: number;

  video_uri: string;

  top_point_x: number;
  top_point_y: number; 
  bottom_point_x: number;
  bottom_point_y: number;

  bend_angle: number;
  force: number;
}

export interface EarthquakePrototypeRecord {
  id?: number;
  session_id?: string;
  timestamp?: string;

  prototype_key: string;
  description: string;
  peakAccel: number;
  avgAccel: number;
}

export interface SoundMapRecord {
  id?: number;
  session_id?: string;
  timestamp?: string;

  latitude: number;
  longitude: number;
  accuracy: number | null;
  location_description: string;

  action: string;

  sound_level_db: number;
  duration: number;

  dot_color: string;
}

export interface ActivitySession {
  session_id: string;
  activity_type: string;  // 'parachute', 'handfan', 'earthquake', 'sound'
  reflection: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export const initDatabase = (): void => {
  if (!db) {
    console.log('Database not available (web or error)');
    return;
  }
  
  try {
    db.execSync(`
      PRAGMA journal_mode = WAL;

      DROP TABLE IF EXISTS handFan_trials;
      DROP TABLE IF EXISTS parachute_trials;
      DROP TABLE IF EXISTS earthquake_trials;
      DROP TABLE IF EXISTS sound_trials;
      DROP TABLE IF EXISTS activity_sessions;

      CREATE TABLE IF NOT EXISTS parachute_trials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        session_id TEXT NOT NULL,

        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

        prototype_key TEXT NOT NULL,

        mass REAL NOT NULL,
        height REAL NOT NULL,

        video_uri TEXT NOT NULL,

        drop_time REAL,
        hit_ground_time REAL,
        bounce_time REAL,
        stop_time REAL,

        g_force REAL NOT NULL,
        v_impact REAL NOT NULL,

        UNIQUE(session_id, prototype_key)
      );

      CREATE TABLE IF NOT EXISTS handFan_trials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        session_id TEXT NOT NULL,

        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

        prototype_key TEXT NOT NULL,

        design REAL NOT NULL,
        distance REAL NOT NULL,
        material TEXT NOT NULL,
        stiffness REAL NOT NULL,

        video_uri TEXT NOT NULL,

        top_point_x REAL NOT NULL,
        top_point_y REAL NOT NULL,
        bottom_point_x REAL NOT NULL,
        bottom_point_y REAL NOT NULL,

        bend_angle REAL NOT NULL,
        force REAL NOT NULL
      );

      CREATE TABLE IF NOT EXISTS earthquake_trials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        session_id TEXT NOT NULL,

        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

        prototype_key TEXT NOT NULL,

        description TEXT NOT NULL,

        peakAccel REAL NOT NULL,

        avgAccel REAL NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sound_trials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,

        session_id TEXT NOT NULL,

        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,

        latitude REAL NOT NULL,

        longitude REAL NOT NULL,

        accuracy REAL,

        location_description TEXT NOT NULL,

        action TEXT NOT NULL,

        sound_level_db REAL NOT NULL,

        duration REAL NOT NULL,

        dot_color TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS activity_sessions (
        session_id TEXT PRIMARY KEY,
        activity_type TEXT NOT NULL,  -- 'parachute', 'handfan', 'earthquake', 'sound'
        reflection TEXT,
        submitted_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database init error:', error);
  }
};

//Parachute DB

export const saveTrialRecord = (record: PrototypeRecord & { session_id: string }): void => {
  if (!db) {
    console.log('Database not available, using localStorage fallback');
    const records = JSON.parse(localStorage.getItem('parachute_records') || '[]');
    records.push({ 
      ...record, 
      id: Date.now(), 
      timestamp: new Date().toISOString() 
    });
    localStorage.setItem('parachute_records', JSON.stringify(records));
    return;
  }

  try {
    db.runSync(
      `
      INSERT OR REPLACE INTO parachute_trials (
          session_id,
          prototype_key,
          mass,
          height,
          video_uri,
          drop_time,
          hit_ground_time,
          bounce_time,
          stop_time,
          g_force,
          v_impact
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
          record.session_id,
          record.prototype_key,
          record.mass,
          record.height,
          record.video_uri,
          record.drop_time,
          record.hit_ground_time,
          record.bounce_time,
          record.stop_time,
          record.g_force,
          record.v_impact
      ]
      );
  } catch (error) {
    console.error('Save error:', error);
  }
};

export const getRecordsByPrototype = (prototypeKey: string): PrototypeRecord[] => {
  if (!db) {
    const records = JSON.parse(localStorage.getItem('parachute_records') || '[]');
    return records.filter((r: PrototypeRecord) => r.prototype_key === prototypeKey);
  }

  try {
    const result = db.getAllSync(
      'SELECT * FROM parachute_trials WHERE prototype_key = ? ORDER BY id DESC',
      [prototypeKey]
    );
    return result as PrototypeRecord[];
  } catch (error) {
    console.error('Get records error:', error);
    return [];
  }
};

export const getAllRecords = (): PrototypeRecord[] => {
  if (!db) {
    return JSON.parse(localStorage.getItem('parachute_records') || '[]');
  }

  try {
    const result = db.getAllSync('SELECT * FROM parachute_trials ORDER BY id DESC');
    return result as PrototypeRecord[];
  } catch (error) {
    console.error('Get all records error:', error);
    return [];
  }
};

export const clearAllRecords = (): void => {
  if (!db) {
    localStorage.removeItem('parachute_records');
    return;
  }

  try {
    db.execSync('DELETE FROM parachute_trials;');
    console.log('All records cleared');
  } catch (error) {
    console.error('Error clearing records:', error);
  }
};

export const getTrialsBySession = (
  sessionId: string
): PrototypeRecord[] => {
  if (!db) return [];

  try {
    return db.getAllSync(
      `
      SELECT *
      FROM parachute_trials
      WHERE session_id = ?
      ORDER BY id DESC
      `,
      [sessionId]
    ) as PrototypeRecord[];
  } catch {
    return [];
  }
};

//Hand Fan DB

export const saveHFTrialRecord = (record: HandFanPrototypeRecord & { session_id: string }): void => {
  if (!db) {
    console.log('Database not available, using localStorage fallback');
    const records = JSON.parse(localStorage.getItem('handFan_records') || '[]');
    records.push({ 
      ...record, 
      id: Date.now(), 
      timestamp: new Date().toISOString() 
    });
    localStorage.setItem('handFan_records', JSON.stringify(records));
    return;
  }

  try {
    db.runSync(
      `
      INSERT OR REPLACE INTO handFan_trials (
          session_id,
          prototype_key,
          design,
          distance,
          material,
          stiffness,
          video_uri,
          top_point_x,
          top_point_y,
          bottom_point_x,
          bottom_point_y,
          bend_angle,
          force
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
          record.session_id,
          record.prototype_key,
          record.design,
          record.distance,
          record.material,
          record.stiffness,
          record.video_uri,
          record.top_point_x,
          record.top_point_y,
          record.bottom_point_x,
          record.bottom_point_y,
          record.bend_angle,
          record.force
      ]
      );
  } catch (error) {
    console.error('Save error:', error);
  }
};

export const getHFRecordsByPrototype = (prototypeKey: string): HandFanPrototypeRecord[] => {
  if (!db) {
    const records = JSON.parse(localStorage.getItem('handFan_records') || '[]');
    return records.filter((r: HandFanPrototypeRecord) => r.prototype_key === prototypeKey);
  }

  try {
    const result = db.getAllSync(
      'SELECT * FROM handFan_trials WHERE prototype_key = ? ORDER BY id DESC',
      [prototypeKey]
    );
    return result as HandFanPrototypeRecord[];
  } catch (error) {
    console.error('Get records error:', error);
    return [];
  }
};

export const getHFAllRecords = (): HandFanPrototypeRecord[] => {
  if (!db) {
    return JSON.parse(localStorage.getItem('handFan_records') || '[]');
  }

  try {
    const result = db.getAllSync('SELECT * FROM handFan_trials ORDER BY id DESC');
    return result as HandFanPrototypeRecord[];
  } catch (error) {
    console.error('Get all records error:', error);
    return [];
  }
};

export const clearHFAllRecords = (): void => {
  if (!db) {
    localStorage.removeItem('handFan_records');
    return;
  }

  try {
    db.execSync('DELETE FROM handFan_trials;');
    console.log('All records cleared');
  } catch (error) {
    console.error('Error clearing records:', error);
  }
};

export const getHFTrialsBySession = (
  sessionId: string
): HandFanPrototypeRecord[] => {
  if (!db) return [];

  try {
    return db.getAllSync(
      `
      SELECT *
      FROM handFan_trials
      WHERE session_id = ?
      ORDER BY id DESC
      `,
      [sessionId]
    ) as HandFanPrototypeRecord[];
  } catch {
    return [];
  }
};

//Earthquake DB

export const saveEarthquakeTrialRecord = (record: EarthquakePrototypeRecord & { session_id: string }): void => {
  if (!db) {
    console.log('Database not available, using localStorage fallback');
    const records = JSON.parse(localStorage.getItem('earthquake_records') || '[]');
    records.push({ 
      ...record, 
      id: Date.now(), 
      timestamp: new Date().toISOString() 
    });
    localStorage.setItem('earthquake_records', JSON.stringify(records));
    return;
  }

  try {
    db.runSync(
      `
      INSERT OR REPLACE INTO earthquake_trials (
          session_id,
          prototype_key,
          description,
          peakAccel,
          avgAccel
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
          record.session_id,
          record.prototype_key,
          record.description,
          record.peakAccel,
          record.avgAccel,
      ]
      );
  } catch (error) {
    console.error('Save error:', error);
  }
};

export const getEarthquakeRecordsByPrototype = (prototypeKey: string): EarthquakePrototypeRecord[] => {
  if (!db) {
    const records = JSON.parse(localStorage.getItem('earthquake_records') || '[]');
    return records.filter((r: EarthquakePrototypeRecord) => r.prototype_key === prototypeKey);
  }

  try {
    const result = db.getAllSync(
      'SELECT * FROM earthquake_trials WHERE prototype_key = ? ORDER BY id DESC',
      [prototypeKey]
    );
    return result as EarthquakePrototypeRecord[];
  } catch (error) {
    console.error('Get records error:', error);
    return [];
  }
};

export const getEarthquakeAllRecords = (): EarthquakePrototypeRecord[] => {
  if (!db) {
    return JSON.parse(localStorage.getItem('earthquake_records') || '[]');
  }

  try {
    const result = db.getAllSync('SELECT * FROM earthquake_trials ORDER BY id DESC');
    return result as EarthquakePrototypeRecord[];
  } catch (error) {
    console.error('Get all records error:', error);
    return [];
  }
};

export const clearEarthquakeAllRecords = (): void => {
  if (!db) {
    localStorage.removeItem('earthquake_records');
    return;
  }

  try {
    db.execSync('DELETE FROM earthquake_trials;');
    console.log('All records cleared');
  } catch (error) {
    console.error('Error clearing records:', error);
  }
};

export const getEarthquakeTrialsBySession = (
  sessionId: string
): EarthquakePrototypeRecord[] => {
  if (!db) return [];

  try {
    return db.getAllSync(
      `
      SELECT *
      FROM earthquake_trials
      WHERE session_id = ?
      ORDER BY id DESC
      `,
      [sessionId]
    ) as EarthquakePrototypeRecord[];
  } catch {
    return [];
  }
};

//Sound Map
export const saveSoundRecord = (record: SoundMapRecord & { session_id: string }): void => {
  if (!db) {
    console.log('Database not available, using localStorage fallback');
    const records = JSON.parse(localStorage.getItem('sound_records') || '[]');
    records.push({ 
      ...record, 
      id: Date.now(), 
      timestamp: new Date().toISOString() 
    });
    localStorage.setItem('sound_records', JSON.stringify(records));
    return;
  }

  try {
    db.runSync(
      `
      INSERT OR REPLACE INTO sound_trials (
          session_id,
          latitude,
          longitude,
          accuracy,
          location_description,
          action,
          sound_level_db,
          duration,
          dot_color
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
          record.session_id,
          record.latitude,
          record.longitude,
          record.accuracy,
          record.location_description,
          record.action,
          record.sound_level_db,
          record.duration,
          record.dot_color
      ]
      );
  } catch (error) {
    console.error('Save error:', error);
  }
};

export const getSoundAllRecords = (): SoundMapRecord[] => {
  if (!db) {
    return JSON.parse(localStorage.getItem('sound_records') || '[]');
  }

  try {
    const result = db.getAllSync('SELECT * FROM sound_trials ORDER BY id DESC');
    return result as SoundMapRecord[];
  } catch (error) {
    console.error('Get all records error:', error);
    return [];
  }
};

export const clearSoundAllRecords = (): void => {
  if (!db) {
    localStorage.removeItem('sound_records');
    return;
  }

  try {
    db.execSync('DELETE FROM sound_trials;');
    console.log('All records cleared');
  } catch (error) {
    console.error('Error clearing records:', error);
  }
};

export const getSoundTrialsBySession = (
  sessionId: string
): SoundMapRecord[] => {
  if (!db) return [];

  try {
    return db.getAllSync(
      `
      SELECT *
      FROM sound_trials
      WHERE session_id = ?
      ORDER BY id DESC
      `,
      [sessionId]
    ) as SoundMapRecord[];
  } catch {
    return [];
  }
};

//Session
export const saveSessionReflection = (
  sessionId: string,
  activityType: string,
  reflection: string
): void => {
  if (!db) {
    // localStorage fallback
    const sessions = JSON.parse(localStorage.getItem('activity_sessions') || '[]');
    const existingIndex = sessions.findIndex((s: any) => s.session_id === sessionId);
    
    const sessionData = {
      session_id: sessionId,
      activity_type: activityType,
      reflection: reflection,
      updated_at: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      sessions[existingIndex] = { ...sessions[existingIndex], ...sessionData };
    } else {
      sessions.push({
        ...sessionData,
        created_at: new Date().toISOString(),
        submitted_at: null
      });
    }
    
    localStorage.setItem('activity_sessions', JSON.stringify(sessions));
    return;
  }

  try {
    db.runSync(
      `
      INSERT OR REPLACE INTO activity_sessions (
        session_id,
        activity_type,
        reflection,
        updated_at
      )
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `,
      [sessionId, activityType, reflection]
    );
  } catch (error) {
    console.error('Save reflection error:', error);
  }
};

// Get session reflection
export const getSessionReflection = (sessionId: string): string | null => {
  if (!db) {
    const sessions = JSON.parse(localStorage.getItem('activity_sessions') || '[]');
    const session = sessions.find((s: any) => s.session_id === sessionId);
    return session?.reflection || null;
  }

  try {
    const result = db.getFirstSync(
      `
      SELECT reflection FROM activity_sessions
      WHERE session_id = ?
      `,
      [sessionId]
    ) as {reflection?: string} | undefined;
    return result?.reflection || null;
  } catch (error) {
    console.error('Get reflection error:', error);
    return null;
  }
};

// Mark session as submitted
export const markSessionSubmitted = (sessionId: string): void => {
  if (!db) {
    const sessions = JSON.parse(localStorage.getItem('activity_sessions') || '[]');
    const index = sessions.findIndex((s: any) => s.session_id === sessionId);
    if (index >= 0) {
      sessions[index].submitted_at = new Date().toISOString();
      localStorage.setItem('activity_sessions', JSON.stringify(sessions));
    }
    return;
  }

  try {
    db.runSync(
      `
      UPDATE activity_sessions
      SET submitted_at = CURRENT_TIMESTAMP
      WHERE session_id = ?
      `,
      [sessionId]
    );
  } catch (error) {
    console.error('Mark submitted error:', error);
  }
};