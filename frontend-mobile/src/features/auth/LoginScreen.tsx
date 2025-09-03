import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from './AuthContext';
import { PrimaryButton, TextField, ErrorMessage } from '../../components/common';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.includes('@')) newErrors.email = 'Invalid email';
    if (!password) newErrors.password = 'Password required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await login(email, password);
    } catch (e: any) {
      setErrors({ general: e.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextField label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" error={errors.email} />
      <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry error={errors.password} />
      <ErrorMessage message={errors.general} />
      <PrimaryButton title="Login" onPress={handleLogin} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});
