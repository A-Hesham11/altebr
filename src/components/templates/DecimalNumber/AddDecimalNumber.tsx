import { t } from 'i18next'
import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { BaseInput, Button, Label } from '../../atoms'
import { useIsRTL } from '../../../hooks'
import { numberFormatterCtx } from '../../../context/settings/number-formatter'
import { notify } from '../../../utils/toast'
import { authCtx } from '../../../context/auth-and-perm/auth'
import { OuterFormLayout } from '../../molecules'

type AddDecimalNumbersProps_TP = {
    title: string
    value?: string
    onAdd?: (value: string) => void
}


const AddDesimalNumber = ({
    title, value, onAdd
}: AddDecimalNumbersProps_TP) => {
    ///

    /////////// CUSTOM HOOKS
    ///
    const isRTL = useIsRTL()
    const { logOutHandler, isLoggingOut } = useContext(authCtx)
    const { digits_count, changeDigitsCount, digits_countLoading } =
    useContext(numberFormatterCtx)
    console.log("🚀 ~ digits_count:", digits_count)
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
            <OuterFormLayout
                header={title}
            >
                <div className="w-[35rem]">

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
            </OuterFormLayout>
        </>
    )
}

export default AddDesimalNumber
