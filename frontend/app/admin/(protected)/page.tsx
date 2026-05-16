'use client';

import { useReducer, useEffect, useCallback } from 'react';
import NumberFlow from '@number-flow/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import AdminSkeleton from '../../components/AdminSkeleton';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Resumen {
  total_ventas: number;
  ingresos_totales: number;
  total_productos: number;
  total_clientes: number;
}

interface VentaMes {
  mes: string;
  cantidad: number;
  ingresos: number;
}

interface StockCategoria {
  categoria: string;
  stock: number;
}

interface RankingItem {
  name: string;
  total_vendido: number;
}

interface DashboardState {
  resumen: Resumen | null;
  ventasMes: VentaMes[];
  stockCategoria: StockCategoria[];
  ranking: RankingItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: Omit<DashboardState, 'loading' | 'error' | 'lastUpdated'> }
  | { type: 'FETCH_ERROR'; error: string };

// ── Reducer ───────────────────────────────────────────────────────────────────

const initialState: DashboardState = {
  resumen: null,
  ventasMes: [],
  stockCategoria: [],
  ranking: [],
  loading: true,
  error: null,
  lastUpdated: null,
};

function dashboardReducer(state: DashboardState, action: Action): DashboardState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: null, ...action.payload, lastUpdated: new Date() };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}

// ── Constants ─────────────────────────────────────────────────────────────────

const PIE_COLORS = ['#7c6ffa', '#f5a623', '#10b981', '#f87171', '#38bdf8', '#e879f9', '#a3e635', '#fb923c'];

const Q = (n: number) =>
  'Q ' + n.toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const fetchDashboard = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const [resumenRes, mesRes, stockRes, rankRes] = await Promise.all([
        fetch('/api/stats/resumen'),
        fetch('/api/stats/ventas-por-mes'),
        fetch('/api/stats/stock-por-categoria'),
        fetch('/api/stats/ranking'),
      ]);

      if (!resumenRes.ok || !mesRes.ok || !stockRes.ok || !rankRes.ok) {
        throw new Error('Error al cargar datos del dashboard');
      }

      const [resumen, ventasMes, stockCategoria, ranking] = await Promise.all([
        resumenRes.json(),
        mesRes.json(),
        stockRes.json(),
        rankRes.json(),
      ]);

      dispatch({
        type: 'FETCH_SUCCESS',
        payload: { resumen, ventasMes, stockCategoria, ranking },
      });
    } catch (e: unknown) {
      dispatch({ type: 'FETCH_ERROR', error: e instanceof Error ? e.message : 'Error desconocido' });
    }
  }, []);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  useEffect(() => {
    const onFocus = () => fetchDashboard();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchDashboard]);

  useEffect(() => {
    const id = setInterval(fetchDashboard, 30_000);
    return () => clearInterval(id);
  }, [fetchDashboard]);

  if (state.loading) return <AdminSkeleton />;

  if (state.error) {
    return (
      <div style={{ background: 'rgba(220,38,38,.2)', border: '1px solid rgba(220,38,38,.4)', borderRadius: 8, padding: '1rem', color: '#fca5a5' }}>
        {state.error} —{' '}
        <button onClick={fetchDashboard} style={{ marginLeft: 8, background: 'none', border: '1px solid #fca5a5', color: '#fca5a5', borderRadius: 6, padding: '4px 12px', cursor: 'pointer' }}>
          Reintentar
        </button>
      </div>
    );
  }

  const { resumen, ventasMes, stockCategoria, ranking, lastUpdated } = state;

  const cardStyle = {
    background: '#0d0f22',
    borderRadius: 12,
    boxShadow: '0 4px 24px rgba(0,0,0,.45)',
    border: '1px solid #1c2040',
    padding: '1.5rem',
  };

  return (
    <>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0f4f 0%, #0f0b30 60%, #06071a 100%)',
        border: '1px solid rgba(245,166,35,.12)',
        borderRadius: 10,
        padding: '2rem',
        marginBottom: '1.5rem',
        color: '#fff',
      }}>
        <h1 style={{ color: '#fcd34d', margin: 0, fontSize: '1.5rem' }}>Panel de Administración</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '.35rem', flexWrap: 'wrap' }}>
          <p style={{ margin: 0, opacity: .7, fontSize: '.9rem' }}>Estadísticas en tiempo real de la tienda</p>
          {lastUpdated && (
            <span style={{ fontSize: '.72rem', background: 'rgba(255,255,255,.12)', borderRadius: 20, padding: '2px 10px', opacity: .85 }}>
              Actualizado {lastUpdated.toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {([
            { label: 'Ventas totales',        num: resumen?.total_ventas ?? 0,    format: {}, color: '#a89dfc' },
          { label: 'Productos en catálogo', num: resumen?.total_productos ?? 0, format: {}, color: '#f5a623' },
          { label: 'Clientes registrados',  num: resumen?.total_clientes ?? 0,  format: {}, color: '#34d399' },
        ] as const).map(({ label, num, format, color }) => (
          <div key={label} style={{ ...cardStyle, textAlign: 'center' }}>
            <NumberFlow
              value={num}
              format={format}
              style={{ fontSize: '1.8rem', fontWeight: 800, color }}
            />
            <div style={{ fontSize: '.8rem', color: '#6b7280', marginTop: '.25rem' }}>{label}</div>
          </div>
        ))}
        <div style={{ ...cardStyle, textAlign: 'center' }}>
          <NumberFlow
            value={resumen?.ingresos_totales ?? 0}
            format={{ style: 'currency', currency: 'GTQ', minimumFractionDigits: 2 }}
            style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f5a623' }}
          />
          <div style={{ fontSize: '.8rem', color: '#6b7280', marginTop: '.25rem' }}>Ingresos totales</div>
        </div>
      </div>

      {/* Line Chart */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Ventas por mes</h2>
          <button
            onClick={fetchDashboard}
            style={{ background: 'none', border: '1px solid #4f46e5', color: '#4f46e5', borderRadius: 6, padding: '5px 12px', fontSize: '.8rem', cursor: 'pointer', fontWeight: 600 }}
          >
            ↻ Actualizar
          </button>
        </div>
        {ventasMes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>Sin datos de ventas por mes.</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={ventasMes} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number, name: string) =>
                name === 'Ingresos (Q)' ? [Q(value), name] : [value, name]
              } />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="cantidad" stroke="#7c6ffa" strokeWidth={2} dot={{ r: 4 }} name="Cantidad" />
              <Line yAxisId="right" type="monotone" dataKey="ingresos" stroke="#f5a623" strokeWidth={2} dot={{ r: 4 }} name="Ingresos (Q)" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar + Pie */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(460px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={cardStyle}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Top productos vendidos</h2>
          {ranking.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Sin datos.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ranking.slice(0, 8)} layout="vertical" margin={{ top: 5, right: 20, left: 90, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={85}
                  tickFormatter={(v: string) => v.length > 14 ? v.slice(0, 14) + '…' : v} />
                <Tooltip formatter={(v: number) => [v, 'Unidades vendidas']} />
                <Bar dataKey="total_vendido" fill="#7c6ffa" radius={[0, 4, 4, 0]} name="Unidades" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div style={cardStyle}>
          <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Stock por categoría</h2>
          {stockCategoria.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Sin datos.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockCategoria}
                  dataKey="stock"
                  nameKey="categoria"
                  cx="50%"
                  cy="45%"
                  outerRadius={100}
                  label={({ name, percent }: { name?: string | number; percent?: number }) =>
                    `${String(name ?? '').slice(0, 10)} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {stockCategoria.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => [v, 'Unidades en stock']} />
                <Legend formatter={(value: string) => value.length > 18 ? value.slice(0, 18) + '…' : value} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Ranking table */}
      <div style={cardStyle}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Ranking completo de productos</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.875rem' }}>
            <thead>
              <tr style={{ background: '#12152e' }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', color: '#5a6485', borderBottom: '2px solid #1c2040' }}>#</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', color: '#5a6485', borderBottom: '2px solid #1c2040' }}>Producto</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', color: '#5a6485', borderBottom: '2px solid #1c2040' }}>Unidades vendidas</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((item, i) => (
                <tr key={item.name} style={{ borderBottom: '1px solid #1c2040' }}>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ background: 'rgba(124,111,250,.15)', color: '#a89dfc', padding: '2px 10px', borderRadius: 999, fontSize: '.75rem', fontWeight: 600 }}>
                      {i + 1}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 500, color: '#dde4f5' }}>{item.name}</td>
                  <td style={{ padding: '10px 14px', color: '#dde4f5' }}>{item.total_vendido}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
