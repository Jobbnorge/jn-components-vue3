import { computed } from "vue";

function existsOnBatch(appId, batch) {
  return batch.value.findIndex(({ appID }) => appID === appId) !== -1;
}

function useCreateSlotValidation(
  selectedSlots,
  requiredNumberSlots,
  numberExisistingSlots,
  interviewBatch
) {
  return computed(() => {
    let _selectedSlots = selectedSlots.value ? selectedSlots.value.length : 0;
    let arr = [];
    if (
      requiredNumberSlots.value >
      numberExisistingSlots.value + _selectedSlots
    )
      arr.push(
        `Du må velge minst ${
          requiredNumberSlots.value -
          (numberExisistingSlots.value + _selectedSlots)
        } slot(s) til`
      );
    if (
      interviewBatch.id === null &&
      (interviewBatch.title == undefined || interviewBatch.title === "")
    )
      arr.push("Intervjurunden trenger et navn");
    return arr;
  });
}

// number selected candidates plus those allready existing on batch
// without duplicates
function useRequiredNumberSlots(selectedCandidates, applicationsOnBatch) {
  if (!Object.prototype.isPrototypeOf.call(Array.prototype, selectedCandidates))
    selectedCandidates = [{ appid: selectedCandidates.id }];

  return computed(() => {
    // remove appIds that exist in 'selectedCandidates' and those that does not allow slot selection
    let arr = applicationsOnBatch.value.filter(
      ({ appID, canChooseInterviewSlot }) =>
        canChooseInterviewSlot &&
        selectedCandidates.findIndex((candidate) => {
          return candidate.appid === appID;
        }) === -1
    );
    return (
      arr.length +
      selectedCandidates.filter(
        ({ appid }) => !existsOnBatch(appid, applicationsOnBatch)
      ).length
    );
  });
}

export { useCreateSlotValidation, useRequiredNumberSlots, existsOnBatch };
