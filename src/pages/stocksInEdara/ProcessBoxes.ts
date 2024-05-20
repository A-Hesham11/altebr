const ProcessBoxes = (boxes) => {
  let processedData = [];

  for (let i = 0; i < boxes.length; i++) {
    let currentBox = boxes[i];

    let newObject = {
      index: currentBox.index,
      date: currentBox.date,
      restriction_name: currentBox.restriction_name,
      bond_id: currentBox.bond_id,
      first_period_debit: currentBox.The_first_period_debtor,
      first_period_credit: currentBox.The_first_period_creditor,
      movement_debit: currentBox.movement_debtor,
      movement_credit: currentBox.movement_creditor,
      balance_debtor:
        currentBox.The_first_period_debtor +
        currentBox.movement_debtor -
        currentBox.movement_creditor,
      balance_credit:
        currentBox.The_first_period_creditor +
        currentBox.movement_creditor -
        currentBox.movement_debtor,
      unit_id: currentBox.unit_id,
    };

    if (i > 0) {
      let prevObject = processedData[i - 1];
      newObject.first_period_debit = prevObject.balance_debtor;
      newObject.first_period_credit = prevObject.balance_credit;
      newObject.balance_debtor =
        prevObject.balance_debtor +
        currentBox.movement_debtor -
        currentBox.movement_creditor;
      newObject.balance_credit =
        prevObject.balance_credit +
        currentBox.movement_creditor -
        currentBox.movement_debtor;
    }

    processedData.push(newObject);
  }

  return processedData;
};

export default ProcessBoxes;
