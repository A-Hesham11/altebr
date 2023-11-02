import { ViewStoneColor } from "../../reusableComponants/stones/view/ViewStoneColor"
import { ViewStoneNature } from "../../reusableComponants/stones/view/ViewStoneNature"
import { ViewStonePurity } from "../../reusableComponants/stones/view/ViewStonePurity"
import { ViewStoneQuality } from "../../reusableComponants/stones/view/ViewStoneQuality"
import { ViewStoneShape } from "../../reusableComponants/stones/view/ViewStoneShape"
import { ViewStoneType } from "../../reusableComponants/stones/view/ViewStoneType"

const View_test = () => {
  return (
    <div>
      {/* <ViewStonePurity /> */}
      {/* <ViewStoneQuality /> */}
      {/* <ViewStoneNature /> */}
      {/* <ViewStoneShape /> */}
      {/* <ViewStoneColor /> */}
      <ViewStoneType />
    </div>
  )
}

export default View_test