import { useI18n } from 'vue-i18n'
import * as yup from 'yup'

export function useValidation() {
  const { t } = useI18n()

  const emailRule = () =>
    yup
      .string()
      .required(t('validation.emailRequired'))
      .email(t('validation.emailInvalid'))
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        t('validation.emailInvalid')
      )

  const passwordRule = (minLength = 6) =>
    yup
      .string()
      .required(t('validation.passwordRequired'))
      .min(minLength, t('validation.passwordMin', { min: minLength }))
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        t('validation.passwordStrength')
      )

  const passwordRuleSimple = (minLength = 6) =>
    yup
      .string()
      .required(t('validation.passwordRequired'))
      .min(minLength, t('validation.passwordMin', { min: minLength }))

  const requiredStringRule = (fieldName: string) =>
    yup
      .string()
      .required(t('validation.required', { field: fieldName }))
      .trim()
      .min(1, t('validation.required', { field: fieldName }))

  const nameRule = (fieldName: string, minLength = 2, maxLength = 50) =>
    yup
      .string()
      .required(t('validation.required', { field: fieldName }))
      .trim()
      .min(minLength, t('validation.minLength', { field: fieldName, min: minLength }))
      .max(maxLength, t('validation.maxLength', { field: fieldName, max: maxLength }))
      .matches(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/,
        t('validation.onlyLetters', { field: fieldName })
      )

  const phoneRule = () =>
    yup
      .string()
      .required(t('validation.phoneRequired'))
      .matches(
        /^[\d\s\-\+\(\)]+$/,
        t('validation.phoneInvalid')
      )
      .min(8, t('validation.phoneMinLength'))
      .max(20, t('validation.phoneMaxLength'))

  const descriptionRule = (minLength = 10, maxLength = 500) =>
    yup
      .string()
      .required(t('validation.descriptionRequired'))
      .trim()
      .min(minLength, t('validation.minLength', { field: t('common.description'), min: minLength }))
      .max(maxLength, t('validation.maxLength', { field: t('common.description'), max: maxLength }))

  const optionalDescriptionRule = (maxLength = 500) =>
    yup
      .string()
      .trim()
      .max(maxLength, t('validation.maxLength', { field: t('common.description'), max: maxLength }))

  const selectRule = (fieldName: string) =>
    yup
      .string()
      .required(t('validation.selectRequired', { field: fieldName }))
      .test('not-empty', t('validation.selectRequired', { field: fieldName }), 
        (value) => value !== '' && value !== undefined && value !== null
      )

  return {
    emailRule,
    passwordRule,
    passwordRuleSimple,
    requiredStringRule,
    nameRule,
    phoneRule,
    descriptionRule,
    optionalDescriptionRule,
    selectRule,
  }
}
