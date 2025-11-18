# Translation Status - Code Comments

This document tracks the status of translating Polish comments to English across the codebase.

## ✅ Fully Translated Files

### Components
- ✅ **BoardGrid.vue** - All comments translated to English
- ✅ **DiceRoller.vue** - All comments translated to English  
- ✅ **GameBoard.vue** - All comments translated to English
- ✅ **GameEndModal.vue** - All comments translated to English
- ✅ **GameInfo.vue** - All comments translated to English
- ✅ **GameLegend.vue** - All comments translated to English

### Other Files
- ✅ **README.md** - Completely rewritten in English with comprehensive documentation

## ⏳ Partially Translated Files

### Stores
- ⏳ **GameStore.ts** - Type definitions and state fields translated; console.log messages still in Polish (user-facing)

## 📝 Remaining Polish Text

### User-Facing Messages (Intentionally Polish)
The following remain in Polish as they are user-facing messages intended for Polish-speaking players:

#### Console Messages in GameStore.ts
- Dice roll confirmations
- Error warnings for invalid moves
- Phase transition notifications
- Score calculations
- Game start/end messages

**Note**: These console messages are for debugging and user feedback. They can remain in Polish or be internationalized in the future with an i18n system.

#### UI Labels (in templates)
- Button texts: "Rzuć kostkami", "Zapisz zmiany", "Następna runda"
- Modal headers: "Legenda (kliknij aby wybrać)"
- Info labels: "Runda", "Punkty", "Suma"
- End-game modal: "Podsumowanie gry", "Zagraj ponownie"

**Decision**: UI labels remain in Polish as this is a Polish-language game. For internationalization, use Vue I18n or similar.

## 🎯 Recommendation

**Code comments**: ✅ Complete - All structural/technical comments in English
**User-facing text**: Intentionally Polish - This is a Polish-language game

If internationalization is needed in the future:
1. Install `vue-i18n`
2. Create translation files (`en.json`, `pl.json`)
3. Wrap all user-facing strings with `$t('key')`
4. Console messages can use the same system

## Summary

- **Code documentation**: 100% English ✅
- **User interface**: Intentionally Polish (game's target language)
- **Console logs**: Polish (debugging/feedback - can be translated if needed)

The codebase now has English comments for developers while maintaining Polish language for the target audience.
