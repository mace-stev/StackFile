const { test, expect } = require('@playwright/test');
test.describe("StackFile website tests", () => {
  // launch browser
  //assert that clicking the sort button one time sorts in ascending order, clicking twice sorts in descending order, and clicking three times doesn't sort at all
  const fileNames = ["mango", "PeAch", "Apple", "banana", "pear"];
  //using different cased words to make my tests case insensitive
  const PANEL = '[data-panel="my"]';
  const FILEROW = '._tbl-Row';
  const SORT_BTN = '._sortBtn';
  const NEW_BTN = 'div[class*="NewButton"]';
  const ADD_DLG = "#dlgAdd";
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const newButton = page.locator(NEW_BTN);
    const dialog = page.locator(ADD_DLG);
    const addFileName = dialog.getByPlaceholder("e.g. Apple");
    const addFileConfirm = dialog.getByText('Add');
    //selecting the button to create new files
    //selecting the add file input and add file confirm button as well
    const panel = page.locator(PANEL);
    const fileRow = panel.locator(FILEROW);
    for (let i = 0; i < fileNames.length; i++) {
      await newButton.waitFor({ state: "visible" });
      await newButton.click();
      await addFileName.waitFor({ state: "visible" });
      await addFileName.fill(fileNames[i]);
      await addFileConfirm.waitFor({ state: "visible" });
      await addFileConfirm.click();
      //waiting for the file name input and confirmation button to be visible before filling and clicking them to create a file
      //using a for loop to iterate through the filenames instead of manually creating each file
    }
    await expect(fileRow).toHaveCount(fileNames.length);
    //making sure that the correct number of files was created
  })
  test("making sure that when clicking the sort button one time the file names are sorted in ascending order", async ({ page }) => {
    const panel = page.locator(PANEL);
    const sortButton = panel.locator(SORT_BTN);
    const fileRow = panel.locator(FILEROW);
    const sortedAsc = [...fileNames].sort((a, b) => {
      return a.toLowerCase() === b.toLowerCase() ? 0 :
        a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    })
    //creating a copy of the file names and sorting them in ascending order to compare with the data rendered on the page
    await sortButton.waitFor({ state: "visible" });
    await sortButton.click();
    await expect(sortButton).toHaveAttribute('data-order', 'asc');
    //confirming that the page expects the order to be ascending before actually testing that the order is rendered as ascending
    await expect(sortButton.locator('span.__arrow')).toHaveText('↑');
    await expect.poll(async () => {
      return await fileRow.locator('.fileLink').allInnerTexts();
    }).toEqual(sortedAsc);
    //using expect.poll to make the request auto-retrying and comparing my sorted array with what is rendered on the page
  });
  test("making sure that when clicking the sort button twice, the file names are sorted in descending order", async ({ page }) => {
    const panel = page.locator(PANEL);
    const sortButton = panel.locator(SORT_BTN);
    const fileRow = panel.locator(FILEROW);
    const sortedDesc = [...fileNames].sort((a, b) => {
      return a.toLowerCase() === b.toLowerCase() ? 0 :
        a.toLowerCase() > b.toLowerCase() ? -1 : 1;
    })
    //creating a copy of the file names and sorting them in descending order to compare with the data rendered on the page
    await sortButton.waitFor({ state: "visible" });
    await sortButton.click();
    await sortButton.waitFor({ state: "visible" });
    await sortButton.click();
    //making sure that the sortButton is visible each time before clicking 
    await expect(sortButton).toHaveAttribute('data-order', 'desc');
    //confirming that the page expects the order to be descending before actually testing that the order is rendered as descending
    await expect(sortButton.locator('span.__arrow')).toHaveText('↓');
    await expect.poll(async () => {
      return await fileRow.locator('.fileLink').allInnerTexts();
    }).toEqual(sortedDesc);
    //using expect.poll to make the request auto-retrying and comparing my sorted array with what is rendered on the page
  });
  test("making sure that when clicking the sort button three times, the list stays ordered as is and the order doesn't change", async ({ page }) => {
    const panel = page.locator(PANEL);
    const sortButton = panel.locator(SORT_BTN);
    const fileRow = panel.locator(FILEROW);

    //creating a copy of the file names and sorting them in descending order to compare with the data rendered on the page
    await sortButton.waitFor({ state: "visible" });
    await sortButton.click();
    await sortButton.waitFor({ state: "visible" });
    await sortButton.click();
    //capturing the current order after the second click (descending is applied)
    const beforeNone = await fileRow.locator('.fileLink').allInnerTexts();

    await sortButton.waitFor({ state: "visible" });
    await sortButton.click();
    //making sure that the sortButton is visible each time before clicking 
    await expect(sortButton).toHaveAttribute('data-order', 'none');
    //confirming that the page expects the order to be none which should not re-sort the list
    await expect(sortButton.locator('span.__arrow')).toHaveText('↕');

    await expect.poll(async () => {
      return await fileRow.locator('.fileLink').allInnerTexts();
    }).toEqual(beforeNone);
    //using expect.poll to make the request auto-retrying and confirming no new sorting is applied
  });
  test("testing that when clicking to remove a file, the correct file row is removed", async ({ page }) => {
    const panel = page.locator(PANEL);
    const fileRow = panel.locator(FILEROW);
    const removeDialog = page.locator("#dlgRemove");
    const removeDialogButton = removeDialog.getByText("Remove", { exact: true })
    const fileToRemove = fileNames[0];
    const fileRowToRemove = fileRow.filter({ hasText: fileToRemove });
    const moreButton = fileRowToRemove.locator("._actMore");
    //grabbing both the correct file row that I would like to remove and its "..." button and then waiting for it to be visible before performing an action on it.
    await moreButton.waitFor({ state: "visible" });
    await moreButton.click();
    await removeDialog.waitFor({ state: "visible" });
    await removeDialogButton.waitFor({ state: "visible" });
    await removeDialogButton.click();
    await expect(fileRow).toHaveCount(fileNames.length - 1);
    //checking that the amount of file rows has decreased by one since the delete action was performed
    await expect.poll(async () => {
      return await fileRow.locator('.fileLink').allInnerTexts();
    }).not.toContain(fileToRemove);
    //grabbing all of the file names and making sure that the file we want gone has actually been removed
    //used expect.poll to make the request auto-retrying
    await expect(fileRowToRemove).not.toBeVisible();
    //last check is just a simple visibility check to make sure the user can no longer see the deleted element.

  })
  test("making sure that when putting in a name for a file and then clicking cancel, no new file is added", async ({ page }) => {
    const newButton = page.locator(NEW_BTN);
    const dialog = page.locator(ADD_DLG);
    const testName = "test_file";
    const addFileName = dialog.getByPlaceholder("e.g. Apple");
    const addDialogCancelButton = dialog.getByText("Cancel", { exact: true });
    const panel = page.locator(PANEL);
    const fileRow = panel.locator(FILEROW);
    await newButton.waitFor({ state: "visible" });
    await newButton.click();
    await dialog.waitFor({ state: "visible" });
    await addFileName.waitFor({ state: "visible" });
    await addFileName.fill(testName);
    await addDialogCancelButton.waitFor({ state: "visible" });
    await addDialogCancelButton.click();
    await expect(fileRow).toHaveCount(fileNames.length);
    await expect.poll(async () => {
      return await fileRow.allInnerTexts();
    }).not.toContain(testName);

  })
  test("testing that when clicking outside of the add file dialog, the dialog closes. ", async ({ page }) => {
    const newButton = page.locator(NEW_BTN);
    const dialog = page.locator(ADD_DLG);
    const addFileName = dialog.getByPlaceholder("e.g. Apple");
    await newButton.waitFor({ state: "visible" });
    await newButton.click();
    await dialog.waitFor({ state: "visible" });
    await dialog.locator('._dlgBk').click({ position: { x: 5, y: 5 } });
    //clicking outside of the modal to prevent the clicks from being intercepted
    await expect(dialog).not.toHaveClass(/_open/);
    //checking that the open class has been removed from the dialog
    await expect(dialog).not.toBeVisible();
    await expect(addFileName).not.toBeVisible();
  })
  test("tests that when leaving the name for a file blank, it uses the fallback name the app implements", async ({ page }) => {
    const newButton = page.locator(NEW_BTN);
    const dialog = page.locator(ADD_DLG);
    const addFileConfirm = dialog.getByText('Add');
    const panel = page.locator(PANEL);
    const fileRow = panel.locator(FILEROW);

    await newButton.waitFor({ state: "visible" });
    await newButton.click();
    await addFileConfirm.waitFor({ state: "visible" });
    await addFileConfirm.click();

    const lastFileRow = fileRow.locator('.fileLink').last();
    await lastFileRow.waitFor({ state: "visible" });

    await expect(fileRow).toHaveCount(fileNames.length + 1);
    await expect.poll(async () => {
      return await lastFileRow.innerText();
    }).toMatch(/^File-\d+$/);

  })
  test("testing that when clicking to remove a file and then clicking cancel, the file isn't removed", async ({ page }) => {
    const panel = page.locator(PANEL);
    const fileRow = panel.locator(FILEROW);
    const removeDialog = page.locator("#dlgRemove");
    const removeDialogCancelButton = removeDialog.getByText("Cancel", { exact: true });
    const fileToRemove = fileNames[0];
    const fileRowToRemove = fileRow.filter({ hasText: fileToRemove });
    const moreButton = fileRowToRemove.locator("._actMore");
    await moreButton.waitFor({ state: "visible" });
    await moreButton.click();
    await removeDialogCancelButton.waitFor({ state: "visible" });
    await removeDialogCancelButton.click();
    await expect(fileRow).toHaveCount(fileNames.length);
    await expect(fileRowToRemove).toBeVisible();
    await expect.poll(async () => {
      return await fileRow.locator(".fileLink").allInnerTexts();
    }).toContain(fileToRemove);
  })
  test("tests that when clicking outside of the remove modal, the modal correctly closes", async ({ page }) => {
    const panel = page.locator(PANEL);
    const fileRow = panel.locator(FILEROW);
    const removeDialog = page.locator("#dlgRemove");
    const removeDialogCancelButton = removeDialog.getByText("Cancel", { exact: true });
    const fileToRemove = fileNames[0];
    const fileRowToRemove = fileRow.filter({ hasText: fileToRemove });
    const moreButton = fileRowToRemove.locator("._actMore");
    await moreButton.waitFor({ state: "visible" });
    await moreButton.click();
    await removeDialog.waitFor({ state: "visible" });
    await removeDialog.locator('._dlgBk').click({ position: { x: 5, y: 5 } });
    //clicking outside of the modal to prevent the clicks from being intercepted
    await expect(removeDialog).not.toHaveClass(/_open/);
    //checking that the open class has been removed from the dialog
    await expect(removeDialog).not.toBeVisible();
    await expect(removeDialogCancelButton).not.toBeVisible();
  });
});
