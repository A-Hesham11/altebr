import { t } from 'i18next'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { BaseInput, Button, Label } from '../../components/atoms'
import { authCtx } from '../../context/auth-and-perm/auth'
import { numberFormatterCtx } from '../../context/settings/number-formatter'
import { useIsRTL } from '../../hooks'
import { notify } from '../../utils/toast'

const DigitsCount = () => {
    ///
    /////////// CUSTOM HOOKS
    ///
    const isRTL = useIsRTL()
    const { logOutHandler, isLoggingOut } = useContext(authCtx)
    const { digits_count, changeDigitsCount, digits_countLoading } =
        useContext(numberFormatterCtx)
    ///
    /////////// STATES
    ///
    const [reyalDigits, setReyalDigits] = useState(digits_count.reyal)
    const [gramDigits, setGramDigits] = useState(digits_count.gram)
    ///
    /////////// SIDE EFFECTS
    ///
    useEffect(() => {
        document.documentElement.dir = isRTL ? "rtl" : "ltr"
        document.documentElement.lang = isRTL ? "ar" : "en"
    }, [isRTL])

    useEffect(() => {
        if (!!digits_count.reyal) {
            setReyalDigits(digits_count.reyal)
        }
        if (!!digits_count.gram) {
            setGramDigits(digits_count.gram)
        }
    }, [digits_count])

    ///
    /////////// FUNCTIONS
    ///
   

    const confirmDigitsCount = () => {
        if (reyalDigits == digits_count.reyal && gramDigits == digits_count.gram) {
            notify("error", `${t('enter different numbers')}`)
            return
        } else if (reyalDigits <= 0 || gramDigits <= 0) {
            notify("error", `${t('enter positive numbers')}`)
            return
        }
        changeDigitsCount({ reyal: reyalDigits, gram: gramDigits })
    }
    const changeReyalDigitsHandler = (e: ChangeEvent<HTMLInputElement>) =>
        setReyalDigits(+e.target.value)

    const changeGramDigitsHandler = (e: ChangeEvent<HTMLInputElement>) =>
        setGramDigits(+e.target.value)
    ///
    return (
        <>
           
            <div className="w-[35rem]">
                <Label htmlFor="countDigits" className="whitespace-nowrap mt-6 mb-3" size="lg">
                    {t('decimal digits count')}
                </Label>

                <div className="flex gap-2 mb-4">

                    <div>
                        <BaseInput
                            label={`${t('reyal')}`}
                            id="reyalDigits"
                            type="number"
                            value={reyalDigits && reyalDigits.toString()}
                            onChange={changeReyalDigitsHandler}
                        />
                    </div>
                    <div>
                        <BaseInput
                            label={`${t('gram')}`}
                            id="gramDigits"
                            type="number"
                            value={gramDigits && gramDigits.toString()}
                            onChange={changeGramDigitsHandler}
                        />
                    </div>
                </div>

                <Button
                    loading={digits_countLoading}
                    action={confirmDigitsCount}
                    className="h-auto w-auto"
                >
                    {t('change numbers')}
                </Button>
            </div>
        </>
    )
}

export default DigitsCount