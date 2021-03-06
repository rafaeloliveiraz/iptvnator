import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { Settings } from './settings.interface';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
    /** Subscription object */
    private subscription: Subscription = new Subscription();

    /** Player options */
    players = [
        {
            id: 'html5',
            label: ' HTML5 Video Player',
        },
        {
            id: 'videojs',
            label: ' VideoJs Player',
        },
    ];

    /** Settings form object */
    settingsForm: FormGroup;

    /**
     * Creates an instance of SettingsComponent and injects some dependencies into the component
     * @param formBuilder
     * @param router
     * @param snackBar
     * @param storage
     */
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private snackBar: MatSnackBar,
        private storage: StorageMap
    ) {
        this.settingsForm = this.formBuilder.group({
            player: ['html5'], // default value
        });
    }

    /**
     * Reads the config object from the browsers storage (indexed db)
     */
    ngOnInit(): void {
        this.subscription.add(
            this.storage.get('settings').subscribe((settings: Settings) => {
                if (settings) {
                    this.settingsForm.setValue(settings);
                }
            })
        );
    }

    /**
     * Triggers on form submit and saves the config object to the indexed db store
     */
    onSubmit(): void {
        this.subscription.add(
            this.storage
                .set('settings', this.settingsForm.value)
                .subscribe(() => {
                    this.settingsForm.markAsPristine();
                    this.snackBar.open(
                        'Success! Configuration was saved.',
                        null,
                        {
                            duration: 2000,
                        }
                    );
                })
        );
    }

    /**
     * Navigates back to the applications homepage
     */
    backToHome(): void {
        this.router.navigateByUrl('/', { skipLocationChange: true });
    }

    /**
     * Unsubscribe on destroy
     */
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
