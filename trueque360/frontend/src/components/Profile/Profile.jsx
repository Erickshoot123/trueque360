import React, { useEffect, useState } from 'react';
import './Profile.css';
import { API_BASE } from '../../api';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [message, setMessage] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            setMessage('No autenticado');
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/perfil`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data && data.user) {
                    setProfile(data.user);
                    setUsername(data.user.username || '');
                    setEmail(data.user.email || '');
                    setRole(data.user.role || '');
                } else if (data && data.msg) {
                    setMessage(data.msg);
                } else {
                    setMessage('No se pudo cargar el perfil.');
                }
            } catch (err) {
                console.error(err);
                setMessage('Error al conectar al servidor.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) {
            setMessage('No autenticado');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/api/perfil`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ username })
            });
            const data = await res.json();
            if (data && data.user) {
                setProfile(data.user);
                setMessage('Perfil actualizado');
            } else if (data && data.msg) {
                setMessage(data.msg);
            } else {
                setMessage('Error al actualizar');
            }
        } catch (err) {
            console.error(err);
            setMessage('Error al conectar al servidor.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="profile-card">Cargando...</div>;

    return (
        <div className="profile-card">
            <div className="profile-header">
                <h2>Mi Perfil</h2>

            </div>
            <div className="profile-body">
                {message && <p className="hint">{message}</p>}

                {/* show an ID line so `profile` state is actually used */}
                {profile && (
                    <div className="field small">
                        <label>ID</label>
                        <input className="input-small" value={profile._id || ''} readOnly />
                    </div>
                )}

                <div className="field">
                    <label>Nombre de usuario</label>
                    <input
                        className="input-large"
                        value={username} readOnly
                        
                    />
                </div>

                <div className="field">
                    <label>Email</label>
                    <input className="input-large readonly" value={email} readOnly />
                </div>

                <div className="field">
                    <label>Rol</label>
                    <input className="input-large readonly" value={role} readOnly />
                </div>

                <div className="profile-actions">
                    <button className="btn-save" onClick={handleSave} disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
