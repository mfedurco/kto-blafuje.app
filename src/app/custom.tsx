import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';

import { BigButton, IconButton } from '@/components/Button';
import { BackChevron, CategoryIcon, CloseIcon } from '@/components/Icons';
import { Screen } from '@/components/Screen';
import { T } from '@/components/T';
import { sk } from '@/constants/sk';
import { colors, font } from '@/constants/theme';
import type { Category } from '@/data/words';
import { useGame } from '@/store/useGame';

const inputStyle = {
  height: 56,
  borderRadius: 20,
  borderWidth: 3,
  borderColor: colors.border,
  backgroundColor: colors.white,
  paddingHorizontal: 16,
  paddingVertical: 0,
  fontFamily: font.semi,
  fontSize: 22,
  color: colors.ink,
} as const;

function CategoryEditor({ category }: { category: Category }) {
  const addCustomWord = useGame((s) => s.addCustomWord);
  const removeCustomWord = useGame((s) => s.removeCustomWord);
  const removeCustomCategory = useGame((s) => s.removeCustomCategory);
  const [word, setWord] = useState('');
  const [hint, setHint] = useState('');
  const [error, setError] = useState<string | null>(null);

  const add = () => {
    const result = addCustomWord(category.id, word, hint);
    if (result === 'hintHasWord') {
      setError(sk.custom.hintHasWord);
      return;
    }
    if (result === 'ok') {
      setWord('');
      setHint('');
      setError(null);
    }
  };

  return (
    <View style={{ backgroundColor: colors.white, borderWidth: 3, borderColor: colors.border, borderRadius: 28, padding: 14, gap: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: category.color, alignItems: 'center', justifyContent: 'center' }}>
          <CategoryIcon name={category.icon} size={28} />
        </View>
        <T size={26} w="bold" lh={30} style={{ flex: 1 }} numberOfLines={1}>
          {category.name}
        </T>
        <IconButton label={sk.custom.deleteCategory} onPress={() => removeCustomCategory(category.id)} size={44} radius={16}>
          <CloseIcon size={20} />
        </IconButton>
      </View>

      {category.words.map((item) => (
        <View key={item.word} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.cream, borderRadius: 18, paddingVertical: 6, paddingLeft: 14, paddingRight: 6 }}>
          <View style={{ flex: 1 }}>
            <T size={22} w="bold" lh={26} numberOfLines={1}>
              {item.word}
            </T>
            {item.hints[0] ? (
              <T size={16} w="medium" lh={20} numberOfLines={1}>
                {item.hints[0]}
              </T>
            ) : null}
          </View>
          <Pressable
            onPress={() => removeCustomWord(category.id, item.word)}
            accessibilityRole="button"
            accessibilityLabel={`${sk.common.delete}: ${item.word}`}
            style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
          >
            <CloseIcon size={18} />
          </Pressable>
        </View>
      ))}

      <TextInput value={word} onChangeText={setWord} placeholder={sk.custom.word} placeholderTextColor="#6B6490" maxLength={24} accessibilityLabel={sk.custom.word} selectionColor={colors.purple} style={inputStyle} />
      <TextInput value={hint} onChangeText={setHint} placeholder={sk.custom.hint} placeholderTextColor="#6B6490" maxLength={20} accessibilityLabel={sk.custom.hint} selectionColor={colors.purple} style={inputStyle} />
      {error ? (
        <T size={18} w="semi" color="#B3234F" lh={22}>
          {error}
        </T>
      ) : null}
      <BigButton label={sk.custom.addWord} onPress={add} variant="teal" height={56} fontSize={24} radius={20} disabled={!word.trim()} />
    </View>
  );
}

export default function Custom() {
  const router = useRouter();
  const customCategories = useGame((s) => s.customCategories);
  const addCustomCategory = useGame((s) => s.addCustomCategory);
  const [name, setName] = useState('');

  const create = () => {
    if (addCustomCategory(name)) setName('');
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, height: 56 }}>
        <IconButton label={sk.common.back} onPress={() => router.back()} size={56} radius={28}>
          <BackChevron />
        </IconButton>
        <T size={34} w="bold" lh={40} style={{ flex: 1 }} numberOfLines={1}>
          {sk.custom.title}
        </T>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 14, gap: 14 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: colors.yellowSoft, borderRadius: 24, padding: 14 }}>
            <T size={20} w="bold" lh={24}>
              {sk.custom.tipTitle}
            </T>
            <T size={18} w="medium" lh={23} style={{ marginTop: 2 }}>
              {sk.custom.tip}
            </T>
          </View>

          <View style={{ gap: 10 }}>
            <T size={22} w="semi" lh={26}>
              {sk.custom.newCategory}
            </T>
            <TextInput value={name} onChangeText={setName} placeholder={sk.custom.categoryName} placeholderTextColor="#6B6490" maxLength={20} accessibilityLabel={sk.custom.categoryName} selectionColor={colors.purple} style={inputStyle} />
            <BigButton label={sk.custom.create} onPress={create} height={60} fontSize={26} radius={22} disabled={!name.trim()} />
          </View>

          {customCategories.length === 0 ? (
            <T size={20} w="medium" lh={26} center>
              {sk.custom.noneYet}
            </T>
          ) : (
            customCategories.map((c) => <CategoryEditor key={c.id} category={c} />)
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
