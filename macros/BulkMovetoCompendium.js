/**
 * Quick'n'dirty GUI for moving (as in copy) entities en-masse to compendiums.
 * Dependency on Plutonium for various library code/CSS.
 */
(() => {
	class BulkMover extends Application {
		static getMaxWindowHeight (desiredHeight) {
			const targetHeight = Math.min(desiredHeight || Number.MAX_SAFE_INTEGER, document.documentElement.clientHeight - 150);
			return Math.max(150, targetHeight);
		}

		static showProgressBar () {
			const $dispProgress = $(`<div style="height: 20px; background: darkred;"></div>`);
			const $btnCancelClose = $(`<button class="btn btn-5et btn-xs"><i class="fas fa-times"></i></button>`)
				.click(() => {
					out.isCancelled = true;
					doCleanup();
				});

			const $bar = $$`<div class="flex-v-center" style="position: fixed; bottom: 90px; left: 0; right: 305px; height: 20px; background: #8888; z-index: 1000000; width: calc(100vw - 305px);">
				<div class="w-100 mr-2">${$dispProgress}</div>
				${$btnCancelClose}
			</div>`.appendTo(document.body);

			const doCleanup = () => {
				$bar.remove();
			};

			const out = {
				setProgress: (count, total) => {
					const pct = count / total || 1;
					$dispProgress.css("width", `${Math.round(pct * 100)}%`);
				},
				isCancelled: false,
				doCleanup
			};
			return out;
		}

		constructor () {
			super({
				width: 800,
				height: BulkMover.getMaxWindowHeight(),
				title: "Bulk Move to Compendium",
				template: `modules/plutonium/template/ImportList.handlebars`,
				resizable: true
			});
		}

		activateListeners ($html) {
			$html.empty().addClass("flex-col h-100 ve-window min-h-0");

			const DIR_METAS = [
				{
					name: "Scenes",
					folderType: "Scene",
					collection: Scene.collection
				},
				{
					name: "Actors",
					folderType: "Actor",
					collection: Actor.collection
				},
				{
					name: "Items",
					folderType: "Item",
					collection: Item.collection
				},
				{
					name: "Journal Entries",
					folderType: "JournalEntry",
					collection: JournalEntry.collection
				},
				{
					name: "Rollable Tables",
					folderType: "RollTable",
					collection: RollTable.collection
				},
				{
					name: "Playlists",
					folderType: "Playlist",
					collection: Playlist.collection
				},
               			{
					name: "Macros",
					folderType: "Macro",
					collection: Macro.collection
				}
			];

			const tabMetas = DIR_METAS.map((meta, i) => {
				let rowMetas = [];

				const $wrpList = $(`<div class="w-100 h-100 overflow-y-auto flex-col min-h-0"></div>`);

				const doPopulate = () => {
					$wrpList.empty();

					meta.collection.entities.forEach(ent => {
						const $cb = $(`<input type="checkbox">`);

						const $row = $$`<label class="row w-100">
							<div class="col-2 flex-vh-center">${$cb}</div>
							<div class="col-10 flex-v-center">${ent.name}</div>
						</label>`.appendTo($wrpList);

						rowMetas.push({
							entityName: ent.name,
							entityId: ent.id,
							$cb,
							$row,
							searchKey: ent.name.toLowerCase().trim(),
							isVisible: true
						});
					});

					$iptSearch.change();
				};

				const $cbAll = $(`<input type="checkbox">`)
					.change(() => {
						const val = $cbAll.prop("checked");
						rowMetas.filter(it => it.isVisible).forEach(it => it.$cb.prop("checked", val));
					});

				const $iptSearch = $(`<input class="mr-2 form-control w-100" type="text" placeholder="Search ${meta.name.toLowerCase()}...">`)
					.change(() => {
						const searchTerm = $iptSearch.val().trim().toLowerCase();
						rowMetas.forEach(it => {
							const isVisible = it.searchKey.includes(searchTerm);
							it.isVisible = isVisible;
							it.$row.toggleVe(isVisible);
						});
					});

				const $btnRefresh = $(`<button class="btn btn-xs btn-5et" title="Refresh List"><i class="fas fa-sync"></i></button>`)
					.click(() => doPopulate());

				const $tab = $$`<div class="flex-col w-100 h-100">
					<div class="w-100 mb-2 row flex-vh-center">
						<label class="flex-vh-center col-2">${$cbAll}</label>
						<div class="flex-v-center col-10">${$iptSearch}${$btnRefresh}</div>
					</div>
					${$wrpList}
				<div/>`;

				// region Footer
				const $selCompendium = $(`<select class="form-control mr-1"></select>`);
				const doPopulateSelCompendium = () => {
					$selCompendium.empty();

					const availPacks = game.packs.filter(it => !it.locked && it.metadata.entity === meta.folderType);
					availPacks.forEach(p => $selCompendium.append(`<option value="${p.collection}">${p.metadata.label}</option>`));
				};

				const $btnRepopulateSelCompendium = $(`<button class="btn btn-5et btn-xs" title="Refresh Compendium List"><i class="fas fa-sync"></i></button>`)
					.click(() => doPopulateSelCompendium())

				const $btnRun = $(`<button class="btn btn-default btn-5et w-100">Run</button>`)
					.click(async () => {
						const compendiumId = $selCompendium.val();
						if (!compendiumId) return ui.notifications.error(`Please select a compendium!`);

						const pack = game.packs.find(p => p.collection === compendiumId);
						if (!pack) return ui.notifications.error(`Could not find compendium "${compendiumId}"`);

						const selRowMetas = rowMetas.filter(it => it.$cb.prop("checked"));

						const packIndex = await pack.getIndex();
						const isOverwrite = $cbOverwriteExisting.prop("checked");

						const progressBar = BulkMover.showProgressBar();

						let cntSuccess = 0;
						let cntError = 0;
						let cntOverwrites = 0;
						for (const selRowMeta of selRowMetas) {
							if (progressBar.isCancelled) break;
							try {
								const entity = meta.collection.get(selRowMeta.entityId);

								const entry = packIndex.find(e => e.name === entity.name);
								if (entry != null && isOverwrite) {
									cntOverwrites++;
									if (progressBar.isCancelled) break;
									await pack.deleteEntity(entry._id);
									if (progressBar.isCancelled) break;
								}
								if (progressBar.isCancelled) break;
								await pack.importEntity(entity);

								cntSuccess++;
							} catch (e) {
								cntError++
								ui.notifications.error(`Failed to transfer ${selRowMeta.entityName} (id ${selRowMeta.entityId})! ${VeCt.STR_SEE_CONSOLE}`);
							}
							progressBar.setProgress(cntSuccess + cntError, selRowMetas.length);
						}
						progressBar.doCleanup();
						ui.notifications.info(`Run complete. ${cntSuccess} entit${cntSuccess === 1 ? "y" : "ies"} moved successfully (${cntOverwrites} overwrite${cntOverwrites === 1 ? "" : "s"}); ${cntError} error${cntError === 1 ? "" : "s"}.`);
					});

				const $cbOverwriteExisting = $(`<input type="checkbox" checked>`)

				const $tabFooter = $$`<div class="w-100 no-shrink flex-v-center">
					<div class="mr-2 flex-col no-shrink">
						<div class="w-100 mb-2">Select Compendium</div>
						<div class="w-100 flex-vh-center">${$selCompendium}${$btnRepopulateSelCompendium}</div>
					</div>

					<div class="flex-col mr-2 no-shrink">
						<label class="flex w-100"><div class="mr-2">Overwrite Existing</div>${$cbOverwriteExisting}</label>
					</div>

					<div class="flex-vh-center w-100 mr-3">
						${$btnRun}
					</div>
				</div>`;
				// endregion

				const out = {
					$tab,
					$tabFooter,
					isActive: i === 0,
					activate: () => {
						out.isActive = true;
						out.$tab.showVe();
						out.$tabFooter.showVe();
						doPopulate();
						doPopulateSelCompendium();
					}
				};
				return out;
			});

			const $btnsTabHeaders = DIR_METAS.map((meta, i) => {
				return $(`<button class="btn btn-5et btn-default w-100">${meta.name}</button>`)
					.click(() => {
						$btnsTabHeaders.forEach(($btn, j) => $btn.toggleClass("active", i === j));

						tabMetas.forEach(meta => {
							meta.isActive = false;
							meta.$tab.hideVe();
							meta.$tabFooter.hideVe();
						});

						const activeMeta = tabMetas[i];
						activeMeta.activate();
					})
			});

			$$($html)`<div class="w-100 h-100 flex-col">
				<div class="flex btn-group w-100 mb-2">${$btnsTabHeaders}</div>
				<div class="flex w-100 h-100 min-h-0">
					${tabMetas.map(meta => meta.$tab)}
				</div>
				${tabMetas.map(meta => meta.$tabFooter)}
			</div>`;

			$btnsTabHeaders[0].click();
		}
	}
	(new BulkMover()).render(true);
})();
